import type {EndpointStatus} from "@/app/types/IEndpoint";
import type {
    MultipartTransferObject,
    NarrowedDestinationOptionsType
} from "@/types/Types";
import type {RemoteStaticEndpointConfigType} from "@/app/types/RemoteStaticEndpointConfigType";
import type {GetRequestInfo, GetRequestInfo__Output} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";
import {Endpoint} from "@/endpoints/Endpoint";
import type {ProtocolType} from "@/types/Types";
import FormData from "form-data";
import {getReaderWriter} from "@/utils/getReaderWriter";
import {Readable} from "node:stream";
import type {ReadableStream} from "stream/web";
import busboy from "busboy";

export class RestApiEndpoint extends Endpoint {
    status: EndpointStatus = "not-connected";
    protocol: ProtocolType = "REST_API";
    host: string | undefined;

    init(config: RemoteStaticEndpointConfigType): Promise<Error | null> {
        this.host = config.host;
        this.status = "connected";
        return null;
    }

    protected getHandler(info: GetRequestInfo):
        NarrowedDestinationOptionsType<"REST_API", "GET"> {
        const reader = new Promise<MultipartTransferObject>(async (resolve, reject) => {
            try {
                const response = await fetch(`http://${this.host}/get?info=${JSON.stringify(info)}`, {
                    method: "GET",
                });
                if (response.status !== 200) {
                    Readable.fromWeb(response.body as ReadableStream).on("data", (value) => {
                        reject(value.toString());
                    })
                    return;
                }

                let infoString: string;
                let stream: Readable;
                const bb = busboy({headers: {"content-type": response.headers.get("content-type")}});
                Readable.fromWeb(response.body as ReadableStream).pipe(bb);
                function resolvePromise() {
                    if (!infoString) {
                        reject()
                    }
                    resolve({
                        info: JSON.parse(infoString),
                        data: stream
                    });
                }

                bb.on("field", (name, value) => {
                    console.log(`[BB] ${name}: ${value}`);
                    if (name == "info") {
                        infoString = value;
                    }
                });

                bb.on("file", (name, value) => {
                    stream = value;
                    console.log(`[BB] ${name}: ${value}`);
                    resolvePromise();
                });

                bb.on("error", (err) => {
                    reject(err);
                });

                bb.on("close", () => {
                    console.log("BB CLOSE");
                    resolvePromise();
                });
            } catch (err) {
                reject(err);
            }
        })

        return {
            requestName: "GET",
            protocol: "REST_API",
            destReader: reader
        }
    }

    protected setHandler(info: DataRequestInfo):
        NarrowedDestinationOptionsType<"REST_API", "SET"> {
        const [_reader, writer] = getReaderWriter();
        const form = new FormData();
        form.append("info", JSON.stringify(info));
        form.append("data", _reader);
        const reader = new Promise<GetRequestInfo__Output>((resolve, reject) =>
            form.submit({
                host: this.host.split(":")[0],
                port: this.host.split(":")[1],
                path: "/set",
                method: "post",
            }, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    res.on("data", (data) => {
                        try {
                            res.statusCode != 200
                                ? reject(JSON.parse(data))
                                : resolve(JSON.parse(data));
                        } catch (e) {
                            reject(e);
                        }
                    })
                }
            }))
        return {
            requestName: "SET",
            protocol: "REST_API",
            destReader: reader,
            destWriter: writer
        }
    }
}


