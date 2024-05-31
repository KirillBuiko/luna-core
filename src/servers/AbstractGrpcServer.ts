// import * as grpc from '@grpc/grpc-js';
// import * as protoLoader from '@grpc/proto-loader';
// import type {ProtoGrpcType} from "@grpc-build/requests";
// import {grpcLoadOptions} from "@/grpcLoadOptions";
// import type {IServer, ServerStatus} from "@/app/types/ICoreServer";
// import type {MainRequestsHandlers} from "@grpc-build/MainRequests";
// import type {ServerConfigType} from "@/app/types/ServerConfigType";
//
// export abstract class AbstractGrpcServer implements IServer {
//     server = new grpc.Server();
//     status: ServerStatus = "off";
//
//     protected constructor(protoPath: string) {
//         const packageDefinition = protoLoader.loadSync(protoPath, grpcLoadOptions);
//         const proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;
//         // const reflection = new ReflectionService(packageDefinition);
//         // reflection.addToServer(this.server);
//         this.server.addService(proto.MainRequests.service, {
//             Get: (call) =>
//                 this.getHandler(call),
//             Set: (call, callback) =>
//                 this.setHandler(call, callback),
//             // Connect: (call) =>
//             //     this.connectHandler(call)
//         } as MainRequestsHandlers);
//     }
//
//     defaultStart(config: ServerConfigType): Promise<Error | null> {
//         return new Promise((resolve) => {
//             this.server.bindAsync(`${config.host}:${config.port}`,
//                 grpc.ServerCredentials.createInsecure(), (error) => {
//                     if (!error) {
//                         this.server.start();
//                         this.status = "on";
//                     }
//                     resolve(error);
//                 });
//         })
//     }
//
//     stop(): Promise<Error | undefined> {
//         return new Promise((resolve) => {
//             this.server.tryShutdown(error => {
//                 if(!error) {
//                     this.status = "off";
//                 }
//                 resolve(error);
//             });
//         });
//     }
//
//     abstract getHandler: MainRequestsHandlers["Get"];
//
//     abstract setHandler: MainRequestsHandlers["Set"];
//
//     // abstract connectHandler: MainRequestsHandlers["Connect"];
// }
