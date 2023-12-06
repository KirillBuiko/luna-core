import type {IServer} from "@/app/types/IServer";
import type {DataRequestsHandlers} from "@grpc-build/DataRequests";
import type {IRequestManager} from "@/app/types/IRequestManager";

import {ProtocolType, RequestName} from "@/types/Enums";
import {AbstractGrpcServer} from "@/servers/AbstractGrpcServer";
import {configs} from "@/configs/configs";
import type {ServerConfigType} from "@/app/types/ServerConfigType";

export class GrpcServer extends AbstractGrpcServer implements IServer {
    requestManager: IRequestManager | undefined = undefined;

    constructor() {
        super(configs.PROTO_PATH);
    }

    async start(config: ServerConfigType, requestManager: IRequestManager): Promise<Error | null> {
        this.requestManager = requestManager;
        return super.startDefault(config);
    }

    getHandler: DataRequestsHandlers["Get"] = (call) => {
        console.log("Get GRPC request", call.request.requestType);
        this.requestManager?.register({
            protocol: ProtocolType.GRPC,
            requestName: RequestName.GET,
            sourceWriter: call,
            sourceReader: undefined
        }, call.request);
    }

    setHandler: DataRequestsHandlers["Set"] = (call, callback) => {
        console.log("Set GRPC request");
        call.on("data", info => {
            if (info.infoOrData === "info") {
                this.requestManager?.register({
                    protocol: ProtocolType.GRPC,
                    requestName: RequestName.SET,
                    sourceWriter: callback,
                    sourceReader: call
                }, info.info);
            } else {
                call.emit("error", "NOT INFO FIRST");
                throw Error("NOT INFO ERROR");
            }
        })
    }
}
