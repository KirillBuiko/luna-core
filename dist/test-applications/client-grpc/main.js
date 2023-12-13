"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TestGrpcClient_1 = require("./TestGrpcClient");
const testObjects_1 = require("../testObjects");
const testConfigs_1 = require("../testConfigs");
(async function main() {
    try {
        const client = new TestGrpcClient_1.TestGrpcClient();
        await client.init(testConfigs_1.testClientConfigs.coreGrpcServer);
        // client.get(testObjects.get);
        client.set(testObjects_1.testObjects.set);
    }
    catch (e) {
        console.log(`Grpc request error: ${e}`);
    }
})();
