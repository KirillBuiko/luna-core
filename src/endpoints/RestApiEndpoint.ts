import type {EndpointStatus} from "@/app/types/IEndpoint";
import type {
    NarrowedDestinationOptionsType
} from "@/types/Types";
import type {EndpointConfigType} from "@/app/types/EndpointConfigType";
import type {GetRequestInfo, GetRequestInfo__Output} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";
import {Endpoint} from "@/endpoints/Endpoint";
import type {ProtocolType} from "@/types/Types";
import FormData from "form-data";
import {getReaderWriter} from "@/utils/getReaderWriter";
import {Readable} from "node:stream";
import type {ReadableStream} from "stream/web";

export class RestApiEndpoint extends Endpoint {
    status: EndpointStatus = "not-connected";
    protocol: ProtocolType = "REST_API";
    host: string | undefined;

    init(config: EndpointConfigType): Promise<Error | null> {
        this.host = config.host;
        this.status = "connected";
        return null;
    }

    protected getHandler(info: GetRequestInfo):
        NarrowedDestinationOptionsType<"REST_API", "GET"> {
        const [reader, _writer] = getReaderWriter();
        fetch(`http://${this.host}/get?info=${JSON.stringify(info)}`, {
            method: "GET"
        }).then((response: Response) =>
            Readable.fromWeb(response.body as ReadableStream).pipe(_writer));
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
                method: "post"
            }, (err, res) => {
                if (err || !res) {
                    reject(err);
                } else {
                    res.on("data", (data) => {
                        resolve(JSON.parse(data));
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


