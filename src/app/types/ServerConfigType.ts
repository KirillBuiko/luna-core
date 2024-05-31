export interface ServerConfigType {
    port: number,
    host: string
}

export type ServerName =
    // | "grpcServer"
    | "restApiServer"

export type ServerConfigsType = {[server in ServerName]: ServerConfigType}
