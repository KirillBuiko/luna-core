import {ServersManager} from "@/servers/ServersManager";
import {serverConfigs} from "@/configs/serverConfigs";
import {EndpointsManager} from "@/endpoints/EndpointsManager";
import {endpointConfigs} from "@/configs/endpointsConfigs";
import {RequestManager} from "@/request-manager/RequestManager";
import {RequestType} from "@grpc-build/RequestType";
import {ProtocolType, RequestName} from "@/types/Enums";

const serversManager = new ServersManager();
const endpointsManager = new EndpointsManager();
const requestsManager = new RequestManager(endpointsManager);

async function main() {
    try {
        await endpointsManager.initAll(endpointConfigs);
        await serversManager.startAll(serverConfigs, requestsManager);
        requestsManager.register({
            requestName: RequestName.GET,
            protocol: ProtocolType.REST_API
        }, {
            requestType: RequestType.VARIABLE
        })
    }
    catch (e) {
        console.log("Core start failed");
    }
}

main();
