"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServersManager_1 = require("@/servers/ServersManager");
const serverConfigs_1 = require("@/configs/serverConfigs");
const EndpointsManager_1 = require("@/endpoints/EndpointsManager");
const RequestManager_1 = require("@/request-manager/RequestManager");
const endpointsConfigs_1 = require("@/configs/endpointsConfigs");
const serversManager = new ServersManager_1.ServersManager();
const endpointsManager = new EndpointsManager_1.EndpointsManager();
const requestsManager = new RequestManager_1.RequestManager(endpointsManager);
async function main() {
    try {
        await endpointsManager.initAll(endpointsConfigs_1.endpointConfigs);
        await serversManager.startAll(serverConfigs_1.serverConfigs, requestsManager);
    }
    catch (e) {
        console.log("Core start failed");
    }
}
main();
