"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TestRestApiClient_1 = require("./TestRestApiClient");
const testObjects_1 = require("../testObjects");
const testConfigs_1 = require("../testConfigs");
(async function main() {
    try {
        const client = new TestRestApiClient_1.TestRestApiClient();
        await client.init(testConfigs_1.testClientConfigs.coreRestServer);
        console.log(await client.get(testObjects_1.testObjects.get));
        // console.log(await client.set(testObjects.set));
    }
    catch (e) {
        console.log(`Fetch error: ${e}`);
    }
})();
