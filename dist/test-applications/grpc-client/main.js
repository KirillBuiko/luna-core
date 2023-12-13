"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TestGrpcClient_1 = require("./TestGrpcClient");
const testObjects_1 = require("../testObjects");
require("@/configs/configs");
const testConfigs_1 = require("../testConfigs");
(async function main() {
    try {
        const client = new TestGrpcClient_1.TestGrpcClient();
        await client.init(testConfigs_1.testClientConfigs.coreGrpcServer);
        client.get(testObjects_1.getProgramInfo);
        // console.log(await client.set(setProgramInfo));
    }
    catch (e) {
        console.log(`Grpc request error: ${e}`);
    }
})();
