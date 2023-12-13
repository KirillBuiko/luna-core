"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testConfigs_1 = require("../testConfigs");
require("../server-grpc/TestGrpcRequestManager");
const RestApiServer_1 = require("@/servers/RestApiServer");
const TestRestApiRequestManager_1 = require("./TestRestApiRequestManager");
(async function main() {
    try {
        const server = new RestApiServer_1.RestApiServer();
        await server.start(testConfigs_1.testServerConfigs.restServer, new TestRestApiRequestManager_1.TestRestApiRequestManager());
        console.log(`Rest api server started`);
    }
    catch (e) {
        console.log(`Rest api server start error: ${e}`);
    }
})();
