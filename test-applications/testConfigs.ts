import {endpointConfigs} from "@/configs/endpointsConfigs";
import {serverConfigs} from "@/configs/serverConfigs";
import path from "path";

export const testConfigs = {
    dataPath: path.join(__dirname, "test-data.txt")
}

export const testServerConfigs = {
    restServer: {port: Number(endpointConfigs.modulesStorage.host.split(":")[1])},
    grpcServer: {port: Number(endpointConfigs.programsStorage.host.split(":")[1])},
};

// export const testClientConfigs = {
//     coreRestServer: {host: `localhost:${serverConfigs.restApiServer.port}`},
//     coreGrpcServer: {host: `localhost:${serverConfigs.grpcServer.port}`},
// }

export const testClientConfigs = {
    coreRestServer: {host: `192.168.12.29:${serverConfigs.restApiServer.port}`},
    coreGrpcServer: {host: `192.168.12.29:${serverConfigs.grpcServer.port}`},
}
