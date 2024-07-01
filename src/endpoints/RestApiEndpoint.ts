import type {EndpointStatus} from "@/request-manager/types/IEndpoint";
import type {
    MultipartTransferObject,
    NarrowedDestination
} from "@/types/general";
import type {RemoteStaticEndpointConfigType} from "@/app/types/RemoteStaticEndpointConfigType";
import type {GetInfo__Output} from "@grpc-build/GetInfo";
import type {DataInfo, DataInfo__Output} from "@grpc-build/DataInfo";
import {Endpoint} from "@/endpoints/Endpoint";
import type {ProtocolType} from "@/types/general";
import FormData from "form-data";
import {PassThrough, Readable, Writable} from "node:stream";
import busboy, {Busboy} from "busboy";
import {randomBoundary} from "@/utils/randomBoundary";
import {ErrorDto} from "@/endpoints/ErrorDto";
import {strTemplates} from "@/endpoints/strTemplates";
import type {HTTPMethods} from "fastify/types/utils";
import fetch, {Response} from "node-fetch";

export type FetchOptions = {
    url: string, method?: HTTPMethods, body?: string | Readable, contentType?: string,
    headers?: Record<string, string>
}
export type FieldType = { key: string, value: string, contentType?: string }

export class RestApiEndpoint extends Endpoint {
    status: EndpointStatus = "not-connected";
    protocol: ProtocolType = "REST_API";
    config: RemoteStaticEndpointConfigType;

    async init(config: RemoteStaticEndpointConfigType): Promise<Error | null> {
        this.config = config;
        this.status = "connected";
        return null;
    }

    protected getGetHandler(info: GetInfo__Output):
        NarrowedDestination<"REST_API", "GET"> {
        const multipart = this.requestMultipart({
            url: `${this.config.host}/api/v1/get`,
            body: JSON.stringify(info)
        })

        const reader = (async (): Promise<MultipartTransferObject> => {
            const resolvedMultipart = await multipart;
            if (!("info" in resolvedMultipart.fields)) {
                throw new ErrorDto("endpoint-error", "No info in multipart");
            }
            return {
                info: JSON.parse(resolvedMultipart.fields.info),
                data: resolvedMultipart.stream
            }
        })()

        return {
            requestName: "GET",
            protocol: "REST_API",
            destReader: reader
        }
    }

    protected getSetHandler(info: DataInfo):
        NarrowedDestination<"REST_API", "SET"> {
        const {reader, dataWriter} = this.sendMultipart({
            url: `${this.config.host}/api/v1/set`,
            method: "POST",
            streamName: "data",
            fields: [
                {key: "info", value: JSON.stringify(info), contentType: "application/json"}
            ]
        })

        const transformedReader = (async () => {
            return await (await reader).json();
        })()

        return {
            requestName: "SET",
            protocol: "REST_API",
            destReader: transformedReader,
            destWriter: dataWriter
        }
    }

    getGetInfo<T>(info: GetInfo__Output) {
        const getInfo = info[info.infoType || ""];
        if (!getInfo) {
            throw new ErrorDto("invalid-argument", strTemplates.notProvided("Get info"));
        }
        return getInfo as NonNullable<T>;
    }

    getDataInfo<T>(info: DataInfo__Output) {
        const dataInfo = info[info.dataValueType || ""];
        if (!dataInfo) {
            throw new ErrorDto("invalid-argument", strTemplates.notProvided("Data info"));
        }
        return dataInfo as NonNullable<T>;
    }

    async baseFetch<T>(options: FetchOptions): Promise<Response> {
        const contentType = options.contentType || options.body && (typeof options.body == "string"
            ? "application/json"
            : "application/octet-stream");
        console.log(options.url);
        const body = options.body && (typeof options.body == "string"
            ? options.body
            : options.body);
        return fetch(options.url, {
            method: options.method ? options.method : (options.body ? "POST" : "GET"),
            body: body,
            headers: {...(contentType && {'Content-Type': contentType}), ...options.headers}
        }).catch(err => {
            throw new ErrorDto("unavailable", "Endpoint is not available: " + err);
        }).then(async response => {
            if (!response.ok) {
                throw new ErrorDto("endpoint-error", {
                    code: response.status,
                    response: await response.text()
                });
            }
            return response;
        })
    }

    async requestStream(options: FetchOptions) {
        return this.baseFetch(options).then(async (response) => {
            return response.body as Readable;
        })
    }

    async requestText(options: FetchOptions) {
        return this.baseFetch(options).then(async (response) => {
            return await response.text();
        })
    }

    async requestJson(options: FetchOptions) {
        return this.baseFetch(options).then(async (response) => {
            return await response.json();
        })
    }

    requestMultipart(options: FetchOptions) {
        return new Promise<{ fields: Record<string, string>, stream: Readable }>
        (async (resolve, reject) => {
            let response: Response;
            try {
                response = await this.baseFetch(options);
            } catch (e) {
                return reject(e);
            }

            let fields: Record<string, string> = {};
            let stream: Readable;
            let bb: Busboy;

            try {
                bb = busboy({headers: {"content-type": response.headers.get("content-type") ?? undefined}});
                response.body.pipe(bb);
            } catch (err) {
                return reject(new ErrorDto("endpoint-error", "Multipart handling error: " + err));
            }

            function resolvePromise() {
                resolve({
                    fields,
                    stream
                });
            }

            bb.on("field", (name, value) => {
                fields[name] = value;
            }).on("file", (name, value) => {
                stream = value;
                resolvePromise();
            }).on("error", (err) => {
                reject(err);
            }).on("close", () => {
                resolvePromise();
            });
        })
    }

    createMultipartBody(options: { method?: string, fields?: FieldType[], streamName?: string }):
        { writer: Writable, reader: Readable, headers: Record<string, string> } {
        const multipartPass = new PassThrough();
        const form = new FormData();
        form.setBoundary(randomBoundary(24, 16));
        options.fields?.forEach((f) => {
            form.append(f.key, f.value, {
                contentType: f.contentType
            })
        });
        options.streamName && form.append(options.streamName, multipartPass);
        return {
            writer: multipartPass,
            reader: form,
            headers: form.getHeaders()
        };
    }

    sendMultipart(options: { url: string, method?: HTTPMethods, fields?: FieldType[], streamName?: string }) {
        const mp = this.createMultipartBody(options);
        const reader = this.baseFetch({
            url: options.url,
            method: options.method || "POST",
            body: mp.reader,
            headers: mp.headers
        })
        return {
            reader,
            dataWriter: mp.writer
        }
    }

    sendStream(options: { url: string, method?: HTTPMethods }) {
        const streamPass = new PassThrough();
        const reader = this.baseFetch({
            ...options,
            contentType: "application/octet-stream",
            body: streamPass
        })
        return {
            reader,
            dataWriter: streamPass
        }
    }
}
