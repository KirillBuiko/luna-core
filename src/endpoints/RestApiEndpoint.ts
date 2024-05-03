import type {EndpointStatus} from "@/app/types/IEndpoint";
import type {
    MultipartTransferObject,
    NarrowedDestinationOptionsType
} from "@/types/Types";
import type {RemoteStaticEndpointConfigType} from "@/app/types/RemoteStaticEndpointConfigType";
import type {GetInfo__Output} from "@grpc-build/GetInfo";
import type {DataInfo} from "@grpc-build/DataInfo";
import {Endpoint} from "@/endpoints/Endpoint";
import type {ProtocolType} from "@/types/Types";
import FormData from "form-data";
import {PassThrough, Readable} from "node:stream";
import type {ReadableStream} from "stream/web";
import busboy from "busboy";

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
        NarrowedDestinationOptionsType<"REST_API", "GET"> {
        const multipart = this.getMultipart({
            url: `${this.config.host}/get?info=${JSON.stringify(info)}`
        })

        const reader = (async (): Promise<MultipartTransferObject> => {
            const resolvedMultipart = await multipart;
            if (!("info" in resolvedMultipart.fields)) {
                throw "No info in multipart";
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
        NarrowedDestinationOptionsType<"REST_API", "SET"> {
        const {reader, dataWriter} = this.sendMultipart({
            url: `${this.config.host}/set`,
            streamName: "data",
            fields: {
                info: JSON.stringify(info)
            }
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

    async getFile(options: { url: string }) {
        const response = await fetch(options.url, {
            method: "GET",
        });
        if (response.status !== 200) {
            Readable.fromWeb(response.body as ReadableStream).on("data", (value) => {
                throw (value.toString());
            });
        }
        return Readable.fromWeb(response.body as ReadableStream);
    }

    async getText(options: { url: string }) {
        const response = await fetch(options.url, {
            method: "GET",
        });
        if (response.status !== 200) {
            Readable.fromWeb(response.body as ReadableStream).on("data", (value) => {
                throw (value.toString());
            });
        }
        return response.text();
    }

    getMultipart(options: { url: string }) {
        return new Promise<{ fields: Record<string, string>, stream: Readable }>
        (async (resolve, reject) => {
            try {
                const response = await fetch(options.url, {
                    method: "GET",
                });
                if (response.status !== 200) {
                    Readable.fromWeb(response.body as ReadableStream).on("data", (value) => {
                        reject(value.toString());
                    })
                    return;
                }

                let fields: Record<string, string> = {};
                let stream: Readable;

                const bb = busboy({headers: {"content-type": response.headers.get("content-type") ?? undefined}});
                Readable.fromWeb(response.body as ReadableStream).pipe(bb);

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
            } catch (err) {
                reject(err);
            }
        })
    }

    sendMultipart(options: {url: string, fields: Record<string, string>, streamName: string}) {
        const multipartPass = new PassThrough();
        const form = new FormData();
        Object.entries(options.fields).forEach((v) => form.append(...v));
        form.append(options.streamName, multipartPass);
        const reader = new Promise<string>((resolve, reject) =>
            form.submit(options.url, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    res.on("data", (data) => {
                        res.statusCode != 200 ? reject(data) : resolve(data);
                    })
                }
            }))
        return {
            reader,
            dataWriter: multipartPass
        }
    }
}


