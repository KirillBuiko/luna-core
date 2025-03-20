export interface ServerConfigType {
    port: number,
    host: string
}

export type ServerName =
    // | "grpcServer"
    | "restApiServer"
    | "operatorsServer"

export type ServerConfigsType = {[server in ServerName]: ServerConfigType}
