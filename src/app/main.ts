import {ServersManager} from "@/servers/ServersManager";
import {serverConfigs} from "../../configs/serverConfigs";
import {EndpointsManager} from "@/endpoints/EndpointsManager";
import {RequestManager} from "@/request-manager/RequestManager";
import {endpointConfigs} from "../../configs/endpointConfigs";
import fs from "fs";
import {configs} from "../../configs/configs";
import {EventBus} from "@/event-bus/EventBus";
import { Logger } from "../../utils/logger";
import {runKiller} from "../../utils/killer";

export let coreLogger = new Logger(__dirname, "CORE");

const eventBus = new EventBus();
const serversManager = new ServersManager();
const endpointsManager = new EndpointsManager();
const requestsManager = new RequestManager({endpointsManager, eventBus});

async function main() {
    try {
        await runKiller(__dirname);
        await endpointsManager.initAll(endpointConfigs);
        await serversManager.startAll(serverConfigs, {
            requestsManager,
            eventBus
        });
    }
    catch (e) {
        await coreLogger.info("Core start failed: ", e);
    }
}

main();
