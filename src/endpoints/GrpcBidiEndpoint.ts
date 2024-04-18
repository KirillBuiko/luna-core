import {Endpoint} from "@/endpoints/Endpoint";
import type {DataRequestsHandlers} from "@grpc-build/DataRequests";
import type {GetRequestInfo} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";
import type {ProtocolType} from "@/types/Types";

export class GrpcBidiEndpoint extends Endpoint {
    protocol: ProtocolType = "GRPC";
    call: Parameters<DataRequestsHandlers["Connect"]>[0];

    init(call: Parameters<DataRequestsHandlers["Connect"]>[0]): void {
        this.call = call;
        call.on("data", (data) => {
            data
        })
    }

    protected getHandler(info: GetRequestInfo) {

    }

    protected setHandler(info: DataRequestInfo) {

    }
}
