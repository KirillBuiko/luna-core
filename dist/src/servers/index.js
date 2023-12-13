"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.servers = void 0;
const RestApiServer_1 = require("@/servers/RestApiServer");
const GrpcServer_1 = require("@/servers/GrpcServer");
exports.servers = {
    "restApiServer": new RestApiServer_1.RestApiServer(),
    "grpcServer": new GrpcServer_1.GrpcServer()
};
