import type {ServerConfigsType} from "@/app/types/ServerConfigType";

export const serverConfigs: ServerConfigsType = {
    restApiServer: {port: Number(process.env.REST_PORT || 5051),
        host: '0.0.0.0'},
    // grpcServer: {port: Number(process.env.GRPC_PORT || 5052),
    //     host: '0.0.0.0'}
}
