import {ServersManager} from "@/servers/ServersManager";
import {serverConfigs} from "@/configs/serverConfigs";
import {EndpointsManager} from "@/endpoints/EndpointsManager";
import {RequestManager} from "@/request-manager/RequestManager";

const serversManager = new ServersManager();
const endpointsManager = new EndpointsManager();
const requestsManager = new RequestManager(endpointsManager);

async function main() {
    try {
        // await endpointsManager.initAll(endpointConfigs);
        await serversManager.startAll(serverConfigs, requestsManager);
    }
    catch (e) {
        console.log("Core start failed");
    }
}

main();
