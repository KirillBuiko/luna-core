import type {IEndpointsManager} from "@/request-manager/types/IEndpointsManager";
import type {IRequestManager} from "@/request-manager/types/IRequestManager";
import {GrpcActions} from "@/servers/actions/GrpcActions";

export class GrpcConnectHandler {
    grpcActions: GrpcActions;

    constructor(private endpointsManager: IEndpointsManager, private requestManager: IRequestManager) {
        this.grpcActions = new GrpcActions(requestManager);
    }

    listenCallMessages() {
        // on request - create proxy and add to array with request id
        // on data from call with id write to specific proxy stream
        // on data
    }
}
