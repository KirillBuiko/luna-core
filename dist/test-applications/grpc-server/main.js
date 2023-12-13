"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testConfigs_1 = require("../testConfigs");
const GrpcServer_1 = require("@/servers/GrpcServer");
const TestGrpcRequestManager_1 = require("./TestGrpcRequestManager");
(async function main() {
    try {
        const server = new GrpcServer_1.GrpcServer();
        await server.start(testConfigs_1.testServerConfigs.grpcServer, new TestGrpcRequestManager_1.TestGrpcRequestManager());
        console.log(`Grpc server started`);
    }
    catch (e) {
        console.log(`Grpc server start error: ${e}`);
    }
})();
