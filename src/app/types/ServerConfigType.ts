export interface ServerConfigType {
    port: number
}

export type ServerName =
    | "grpcServer"
    | "restApiServer";

export type ServerConfigsType = {[server in ServerName]: ServerConfigType}
