import type {ServerName} from "@/app/types/ServerConfigType";
import type {IServer} from "@/app/types/IServer";
import {RestApiServer} from "@/servers/RestApiServer";
import {GrpcServer} from "@/servers/GrpcServer";

export const servers: {[server in ServerName]: IServer} = {
    "restApiServer": new RestApiServer(),
    "grpcServer": new GrpcServer()
}