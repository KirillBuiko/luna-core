"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testClientConfigs = exports.testServerConfigs = exports.testConfigs = void 0;
const endpointsConfigs_1 = require("@/configs/endpointsConfigs");
const serverConfigs_1 = require("@/configs/serverConfigs");
const path_1 = __importDefault(require("path"));
exports.testConfigs = {
    dataPath: path_1.default.join(__dirname, "test-data.txt")
};
exports.testServerConfigs = {
    restServer: { port: Number(endpointsConfigs_1.endpointConfigs.modulesStorage.host.split(":")[1]) },
    grpcServer: { port: Number(endpointsConfigs_1.endpointConfigs.programsStorage.host.split(":")[1]) },
};
exports.testClientConfigs = {
    coreRestServer: { host: `localhost:${serverConfigs_1.serverConfigs.restApiServer.port}` },
    coreGrpcServer: { host: `localhost:${serverConfigs_1.serverConfigs.grpcServer.port}` },
};
