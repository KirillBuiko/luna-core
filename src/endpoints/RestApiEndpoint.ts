import type {EndpointStatus} from "@/app/types/IEndpoint";
import type {
    NarrowedDestinationOptionsType
} from "@/types/Types";
import type {EndpointConfigType} from "@/app/types/EndpointConfigType";
import type {GetRequestInfo} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";
import {Endpoint} from "@/endpoints/Endpoint";
import type {ProtocolType} from "@/types/Types";
import {Readable} from "node:stream";
import FormData from "form-data";
import {getReaderWriter} from "@/utils/getReaderWriter";

export class RestApiEndpoint extends Endpoint {
    status: EndpointStatus = "not-connected";
    protocol: ProtocolType = "REST_API";
    host: string | undefined;

    init(config: EndpointConfigType): Promise<Error | null> {
        this.host = config.host;
        return null;
    }

    protected getHandler(info: GetRequestInfo):
        NarrowedDestinationOptionsType<"REST_API", "GET"> {
        // @ts-ignore
        // reader
        const reader = Readable.fromWeb((await fetch(`http://${this.host}/get` +
            `?info=${JSON.stringify(info)}`, {
            method: "GET",
        })).body);
        return {
            requestName: "GET",
            protocol: this.protocol,
            destReader: reader
        }
    }

    protected setHandler(info: DataRequestInfo):
        NarrowedDestinationOptionsType<"REST_API", "SET"> {
        const form = new FormData();
        const [r, writer] = getReaderWriter();
        form.append("info", JSON.stringify(info));
        form.append("data", r);
        return await fetch(`http://${this.host}/set`, {
            method: "POST",
            // headers: {"Content-Type": "multipart/form-data"},
            body: Readable.toWeb(form),
            // @ts-ignore
            duplex: "half"
        }).then(res => res.text());
        return {
            requestName: "SET",
            protocol: this.protocol,
            // destReader: reader,
            // destWriter: writer
        }
    }
}


