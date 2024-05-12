import {endpointConfigs} from "../configs/endpointConfigs";
import {serverConfigs} from "../configs/serverConfigs";
import path from "path";

export const testConfigs = {
    dataPath: path.join(__dirname, "test-data.txt")
}

export const testServerConfigs = {
    restServer: {host: "0.0.0.0", port: Number(endpointConfigs.cfStorage.host.split(":").at(-1))},
    grpcServer: {host: "0.0.0.0", port: Number(endpointConfigs.programsStorage.host.split(":").at(-1))},
};

export const testClientConfigs = {
    coreRestServer: {host: `http://localhost:${serverConfigs.restApiServer.port}`},
    coreGrpcServer: {host: `http://localhost:${serverConfigs.grpcServer.port}`},
}

// export const testClientConfigs = {
//     coreRestServer: {host: `192.168.12.29:${serverConfigs.restApiServer.port}`},
//     coreGrpcServer: {host: `192.168.12.29:${serverConfigs.grpcServer.port}`},
// }
