import assert from "assert";
import * as http from "node:http";
import type {RemoteStaticEndpointConfigType} from "../../src/app/types/RemoteStaticEndpointConfigType";
import {endpointsLogger} from "../main";

const DEFAULT_REASONS = {
	"200": "OK",
	"201": "Created",
	"204": "No Content",
	"400": "Bad Request",
	"404": "Not Found"
};

// STORAGE

function Storage() {
	const db = {};

	function create_record(data) {
		const data_b64 = Buffer.from(data).toString('base64');

		let counter = 0;
		let id = `${Date.now()}`;
		while (true) {

			if (!(id in db))
				break;

			id = `${Date.now()}:${counter++}`;
		}

		assert(!(id in db));
		db[id] = {val: data_b64};

		return id;
	}

	this.get_keys = function () {
		return use => {
			use(Object.keys(db));
		};
	}

	this.create_value = function (data_provider) {
		return use => {
			data_provider(data => {
				use(create_record(data));
			});
		};
	}

	this.get_value = function (id, val_cb, miss_cb) {
		if (id in db)
			val_cb(use => use(Buffer.from(db[id].val, "base64")));
		else
			miss_cb();
	}

	this.erase = function (id, done_cb, miss_cb) {
		if (id in db) {
			delete db[id];
			done_cb();
		} else
			miss_cb();
	}

	this.reset_meta = function (id, meta_provider, cb, miss_cb) {
		if (meta_provider === undefined)
			meta_provider = use => use(undefined);

		meta_provider(meta => {
			if (!(id in db))
				return miss_cb();

			db[id].meta = meta;
			cb();
		});
	}

	this.get_meta = function (id, cb, miss_cb) {
		return id in db ? cb(db[id].meta) : miss_cb();
	}
}

// SERVICE

function parse_url(url_string) {
	const tokens = url_string.split('/').slice(1);

	if (url_string === '')
		return {};

	if (tokens.length === 1)
		return {id: tokens[0]};
	else
		return {id: tokens[0], meta: true};
}

function fetch_bin(req) {
	return use => {
		const chunks: Buffer[] = [];
		req.on('data', (chunk: Buffer) => chunks.push(chunk));
		req.on('end', () => {
			use(Buffer.concat(chunks));
		});
	};
}

function fetch_json(req) {
	return use => {
		fetch_bin(req)(data => use(JSON.parse(data)));
	}
}

function parse_status(status: number | string) {
	let code, reason;

	if (typeof status === "number") {
		code = status;
	} else if (typeof status === "string") {
		const code_str = status.split(' ')[0];
		code = parseInt(code_str);
		assert("" + code === code_str);
		reason = status.substr(code_str.length + 1);
		if (reason === '')
			reason = undefined;
	} else {
		const err = Error("bad status");
		(err as any).status = status;
		throw err;
	}

	assert(code !== undefined)
	assert(code in DEFAULT_REASONS, code);
	if (reason === undefined)
		reason = DEFAULT_REASONS[code];
	return {code, reason};
}

const cors_headers = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
	'Access-Control-Max-Age': 2592000 // 30 days
};

function Responder(res) {
	// Status format: 200 | "200 OK"
	function respond(status, content_type?, data?) {
		const {code, reason} = parse_status(status);

		if (code === 204)
			assert(data === undefined);

		if (reason)
			res.statusMessage = reason;

		if (content_type !== undefined)
			cors_headers['Content-Type'] = content_type;
		else
			delete cors_headers['Content-Type'];
		res.writeHead(code, cors_headers);

		res.end(data);
	}

	this.text = (status, text_provider) =>
		text_provider(data => respond(status, 'text/plain', data));

	this.bin = (status, bin_provider) =>
		bin_provider(data => respond(status, 'octet/stream', data));

	this.empty = status => status === undefined ? respond(204) : respond(status);

	this.json = (status, obj_provider) =>
		obj_provider(obj => respond(status, 'application/json',
			JSON.stringify(obj)));
}


const type = what => (
	use => use(what)
);

const rjust = what => what.length < 6 ? ' '.repeat(6 - what.length) + what : what;

function handle_request(req, res, storage, url_prefix, config) {
	endpointsLogger.info(config.name, rjust(req.method), req.url);

	const r = new Responder(res);

	if (!req.url.startsWith(url_prefix))
		return r.empty(400, "illegal prefix");

	const {id, meta} = parse_url(req.url.substr(url_prefix.length));
	const method = req.method;

	if (method === "OPTIONS")
		r.empty(204);

	else if (method === "GET" && !id)
		r.json(200, storage.get_keys());

	else if (method === "POST" && !meta)
		r.text("201 Created",
			storage.create_value(fetch_bin(req)));

	else if (method === "GET" && id && !meta) {
		storage.get_value(id, val => (
			r.bin(200, val)
		), () => r.text(404, type("id not found")));

	} else if (method === "DELETE" && id && !meta) {
		storage.erase(id, () => (
			r.empty("204 Deleted")
		), () => r.text(404, type("id not found")));

	} else if (method === "PUT" && meta) {
		storage.reset_meta(id, fetch_json(req),
			() => r.empty("204 Updated"),
			() => r.text(404, type("id not found")));

	} else if (method === "GET" && meta) {
		storage.get_meta(id, meta => meta === undefined ?
				r.empty() : r.json(200, type(meta)),
			() => r.text(404, type("id not found")));

	} else if (method === "DELETE" && meta) {
		storage.reset_meta(id, undefined,
			() => r.empty("204 Deleted"),
			() => r.text(404, type("id not found")));
	} else
		r.empty(400);
}

// MAIN

export function initVariableStorage1(config?: RemoteStaticEndpointConfigType) {
	const storage = new Storage();
	const urlPrefix = "/valst";

	if (!config) {
		throw new Error("No config provided");
	}
	const url = new URL(config.host);

	http.createServer((req, resp) => handle_request(req, resp, storage, urlPrefix, config))
		.listen(Number(url.port), url.hostname, () => {
			endpointsLogger.info(`Server running at ${config.host}${urlPrefix}`);
		});
}


