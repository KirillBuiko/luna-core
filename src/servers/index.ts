import type {ServerName} from "@/app/types/ServerConfigType";
import type {IServer} from "@/app/types/ICoreServer";
import {RestApiServer} from "@/servers/rest-api/RestApiServer";
// import {GrpcServer} from "@/servers/GrpcServer";

export const servers: {[server in ServerName]: IServer} = {
    "restApiServer": new RestApiServer(),
    // "grpcServer": new GrpcServer()
}
