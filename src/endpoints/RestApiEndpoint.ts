import type {EndpointStatus} from "@/request-manager/types/IEndpoint";
import type {
    MultipartTransferObject,
    NarrowedDestination
} from "@/types/Types";
import type {RemoteStaticEndpointConfigType} from "@/app/types/RemoteStaticEndpointConfigType";
import type {GetInfo__Output} from "@grpc-build/GetInfo";
import type {DataInfo, DataInfo__Output} from "@grpc-build/DataInfo";
import {Endpoint} from "@/endpoints/Endpoint";
import type {ProtocolType} from "@/types/Types";
import FormData from "form-data";
import {PassThrough, Readable} from "node:stream";
import type {ReadableStream} from "stream/web";
import busboy, {Busboy} from "busboy";
import {randomBoundary} from "@/utils/randomBoundary";
import {ErrorDto} from "@/endpoints/ErrorDto";
import {strTemplates} from "@/endpoints/strTemplates";
import type {HTTPMethods} from "fastify/types/utils";

type FetchOptions = { url: string, method?: HTTPMethods, body?: string, contentType?: string }
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
            method: "SET",
            streamName: "data",
            fields: [
                {key: "info", value: JSON.stringify(info), contentType: "application/json"}
            ]
        })

        const transformedReader = (async () => {
            const resolved = await reader;
            return JSON.parse(resolved);
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
        options.contentType = options.body && (options.contentType || "application/json");
        return fetch(options.url, {
            method: options.method ? options.method : (options.body ? "POST" : "GET"),
            body: options.body,
            headers: {...(options.contentType ? {'Content-Type': options.contentType} : {})}
        }).catch(err => {
            throw new ErrorDto("unavailable", "Endpoint is not available: " + err);
        }).then(async response => {
            if (!response.ok) {
                throw new ErrorDto("endpoint-error", await response.text());
            }
            return response;
        })
    }

    async requestStream(options: FetchOptions) {
        return this.baseFetch(options).then(async (response) => {
            return Readable.fromWeb(response.body as ReadableStream);
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
                Readable.fromWeb(response.body as ReadableStream).pipe(bb);
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

    sendMultipart(options: { url: string, method?: string, fields?: FieldType[], streamName: string }) {
        const multipartPass = new PassThrough();
        const form = new FormData();
        form.setBoundary(randomBoundary(24, 16));
        options.fields?.forEach((f) => {
            form.append(f.key, f.value, {
                contentType: f.contentType
            })
        });
        form.append(options.streamName, multipartPass);
        const reader = new Promise<string>((resolve, reject) => {
            const parsedUrl = new URL(options.url);
            form.submit({
                ...parsedUrl,
                protocol: parsedUrl.protocol as "http:",
                method: options.method
            }, (err, res) => {
                if (err) {
                    reject(new ErrorDto("unavailable", "Endpoint is not available: " + err));
                } else {
                    res.on("data", (data) => {
                        res.statusCode && res.statusCode > 399
                            ? reject(new ErrorDto("endpoint-error", data.toString()))
                            : resolve(data.toString());
                    })
                }
            })
        })
        return {
            reader,
            dataWriter: multipartPass
        }
    }
}
