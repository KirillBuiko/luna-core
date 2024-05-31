// import type {ICoreServer} from "@/app/types/ICoreServer";
// import type {MainRequestsHandlers} from "@grpc-build/MainRequests";
// import type {IRequestManager} from "@/request-manager/types/IRequestManager";
//
// import {AbstractGrpcServer} from "@/servers/AbstractGrpcServer";
// import {configs} from "../../configs/configs";
// import type {ServerConfigType} from "@/app/types/ServerConfigType";
// import {GrpcActions} from "@/servers/actions/GrpcActions";
//
// export class GrpcServer extends AbstractGrpcServer implements ICoreServer {
//     requestManager: IRequestManager | undefined = undefined;
//     grpcActions: GrpcActions;
//
//     constructor() {
//         super(configs.PROTO_PATH);
//     }
//
//     async start(config: ServerConfigType, requestManager: IRequestManager): Promise<Error | null> {
//         this.requestManager = requestManager;
//         this.grpcActions = new GrpcActions(this.requestManager);
//         return super.defaultStart(config);
//     }
//
//     getHandler: MainRequestsHandlers["Get"] = (call) => {
//         return this.grpcActions.getHandler(call);
//     }
//
//     setHandler: MainRequestsHandlers["Set"] = (call, callback) => {
//         return this.grpcActions.setHandler(call, callback);
//     }
//
//     connectHandler: MainRequestsHandlers["Connect"] = () => {
//         // TODO: write creating grpc connect handler
//     }
// }
