import {endpointConfigs} from "@/configs/endpointsConfigs";
import {serverConfigs} from "@/configs/serverConfigs";

export const testServerConfigs = {
    restServer: {port: Number(endpointConfigs.modulesStorage.host.split(":")[1])},
    grpcServer: {port: Number(endpointConfigs.programsStorage.host.split(":")[1])},
};

export const testClientConfigs = {
    coreRestServer: {host: `localhost:${serverConfigs.restApiServer.port}`},
    coreGrpcServer: {host: `localhost:${serverConfigs.grpcServer.port}`},
}
