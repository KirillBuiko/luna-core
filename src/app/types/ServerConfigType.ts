export interface ServerConfigType {
    port: number
}

export type ServerName =
    | "grpc-server"
    | "rest-api-server";

export type ServerConfigsType = {[server in ServerName]: ServerConfigType}
