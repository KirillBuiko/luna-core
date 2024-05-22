import {ServersManager} from "@/servers/ServersManager";
import {serverConfigs} from "../../configs/serverConfigs";
import {EndpointsManager} from "@/endpoints/EndpointsManager";
import {RequestManager} from "@/request-manager/RequestManager";
import {endpointConfigs} from "../../configs/endpointConfigs";
import fs from "fs";
import {configs} from "../../configs/configs";

const serversManager = new ServersManager();
const endpointsManager = new EndpointsManager();
const requestsManager = new RequestManager({endpointsManager});

function writePid() {
    const pid = process.pid;
    fs.createWriteStream(configs.PID_PATH).end(pid.toString());
}
async function main() {
    try {
        writePid();
        await endpointsManager.initAll(endpointConfigs);
        await serversManager.startAll(serverConfigs, requestsManager);
    }
    catch (e) {
        console.log("Core start failed: ", e);
    }
}

main();
