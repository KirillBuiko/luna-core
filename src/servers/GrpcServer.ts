import type {IServer} from "@/app/types/IServer";
import type {DataRequestsHandlers} from "@grpc-build/DataRequests";
import type {IRequestManager} from "@/app/types/IRequestManager";

import {AbstractGrpcServer} from "@/servers/AbstractGrpcServer";
import {configs} from "@/configs/configs";
import type {ServerConfigType} from "@/app/types/ServerConfigType";
import {ErrorMessage} from "@/utils/ErrorMessage";
import {Status} from "@grpc/grpc-js/build/src/constants";

export class GrpcServer extends AbstractGrpcServer implements IServer {
    requestManager: IRequestManager | undefined = undefined;

    constructor() {
        super(configs.PROTO_PATH);
    }

    async start(config: ServerConfigType, requestManager: IRequestManager): Promise<Error | null> {
        this.requestManager = requestManager;
        return super.defaultStart(config);
    }

    getHandler: DataRequestsHandlers["Get"] = (call) => {
        console.log("Get GRPC request", call.request.requestType);
        this.requestManager?.register({
            protocol: "GRPC",
            requestName: "GET",
            writer: call,
            sourceReader: undefined
        }, call.request);
    }

    setHandler: DataRequestsHandlers["Set"] = (call, callback) => {
        console.log("Set GRPC request");
        call.once("data", info => {
            if (info.infoOrData === "info") {
                this.requestManager?.register({
                    protocol: "GRPC",
                    requestName: "SET",
                    writer: callback,
                    sourceReader: call
                }, info.info);
            } else {
                call.destroy(ErrorMessage.create(Status.FAILED_PRECONDITION, "Not info first"));
            }
        })
    }
}
