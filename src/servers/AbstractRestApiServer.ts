// import type {ICoreServer, IServer} from "@/app/types/ICoreServer";
// import type {ServerStatus} from "@/app/types/ICoreServer";
// import Fastify, {RouteHandlerMethod} from "fastify";
// import type {ServerConfigType} from "@/app/types/ServerConfigType";
// import {configs} from "../../configs/configs";
// import {IRequestManager} from "@/request-manager/types/IRequestManager";
//
// export abstract class AbstractRestApiServer implements ICoreServer {
//     status: ServerStatus = "off";
//     server = Fastify();
//
//     protected constructor() {
//
//     }
//
//     async defaultStart(config: ServerConfigType): Promise<Error | null> {
//         try {
//             await this.server.listen({
//                 port: config.port,
//                 host: config.host
//             });
//         } catch (err) {
//             return err as Error;
//         }
//         this.status = "on";
//         return null;
//     }
//
//     async stop(): Promise<Error | undefined> {
//         if (this.status == "off") return;
//         this.status = "off";
//         return this.server.close();
//     }
//
//     abstract start(config: ServerConfigType, requestManager: IRequestManager): Promise<Error | null>;
//
//     protected abstract getHandler: RouteHandlerMethod;
//
//     protected abstract setHandler: RouteHandlerMethod;
//
//     protected abstract debugHandler: RouteHandlerMethod;
// }
