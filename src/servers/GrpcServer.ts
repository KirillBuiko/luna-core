import type {IServer} from "@/app/types/IServer";
import type {DataRequestsHandlers} from "@grpc-build/DataRequests";
import type {IRequestManager} from "@/app/types/IRequestManager";

import {AbstractGrpcServer} from "@/servers/AbstractGrpcServer";
import {configs} from "@/configs/configs";
import type {ServerConfigType} from "@/app/types/ServerConfigType";
import {GrpcActions} from "@/servers/actions/GrpcActions";

export class GrpcServer extends AbstractGrpcServer implements IServer {
    requestManager: IRequestManager | undefined = undefined;
    grpcActions: GrpcActions;

    constructor() {
        super(configs.PROTO_PATH);
    }

    async start(config: ServerConfigType, requestManager: IRequestManager): Promise<Error | null> {
        this.requestManager = requestManager;
        this.grpcActions = new GrpcActions(this.requestManager);
        return super.defaultStart(config);
    }

    getHandler: DataRequestsHandlers["Get"] = (call) => {
        return this.grpcActions.getHandler(call);
    }

    setHandler: DataRequestsHandlers["Set"] = (call, callback) => {
        return this.grpcActions.setHandler(call, callback);
    }

    connectHandler: DataRequestsHandlers["Connect"] = () => {
        // TODO: write creating grpc connect handler
    }
}
