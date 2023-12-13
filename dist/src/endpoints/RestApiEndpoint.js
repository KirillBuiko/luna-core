"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestApiEndpoint = void 0;
const Endpoint_1 = require("@/endpoints/Endpoint");
const form_data_1 = __importDefault(require("form-data"));
const getReaderWriter_1 = require("@/utils/getReaderWriter");
const node_stream_1 = require("node:stream");
class RestApiEndpoint extends Endpoint_1.Endpoint {
    status = "not-connected";
    protocol = "REST_API";
    host;
    init(config) {
        this.host = config.host;
        this.status = "connected";
        return null;
    }
    getHandler(info) {
        const [reader, _writer] = (0, getReaderWriter_1.getReaderWriter)();
        fetch(`http://${this.host}/get?info=${JSON.stringify(info)}`, {
            method: "GET"
        }).then((response) => node_stream_1.Readable.fromWeb(response.body).pipe(_writer));
        return {
            requestName: "GET",
            protocol: "REST_API",
            destReader: reader
        };
    }
    setHandler(info) {
        const [_reader, writer] = (0, getReaderWriter_1.getReaderWriter)();
        const form = new form_data_1.default();
        form.append("info", JSON.stringify(info));
        form.append("data", _reader);
        const reader = new Promise((resolve, reject) => form.submit({
            host: this.host.split(":")[0],
            port: this.host.split(":")[1],
            path: "/set",
            method: "post"
        }, (err, res) => {
            if (err || !res) {
                reject(err);
            }
            else {
                res.on("data", (data) => {
                    resolve(JSON.parse(data));
                });
            }
        }));
        return {
            requestName: "SET",
            protocol: "REST_API",
            destReader: reader,
            destWriter: writer
        };
    }
}
exports.RestApiEndpoint = RestApiEndpoint;
