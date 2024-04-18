import type {IEndpointsManager} from "@/app/types/IEndpointsManager";
import type {EndpointConfigsType, EndpointName} from "@/app/types/RemoteStaticEndpointConfigType";
import {endpoints} from "./index";

export class EndpointsManager implements IEndpointsManager {
    getEndpoint(endpointName: EndpointName) {
        return endpoints[endpointName];
    }

    async initAll(configs: EndpointConfigsType) {
        console.log("Endpoints are initiating");
        const promises = Object.keys(endpoints).map(async endpointName => {
            const endpoint = endpoints[endpointName as EndpointName];
            const config = configs[endpointName as EndpointName];
            try {
                const err = await endpoint.init(config);
                if (err) {
                    console.log(`The endpoint "${endpointName}" init attempt failed with error: ${err.message}`);
                } else {
                    console.log(`The endpoint "${endpointName}" connected to host ${config.host}`);
                }
            } catch (err) {
                console.log(err);
                throw err;
            }
        });
        await Promise.allSettled(promises);
        console.log("Endpoints init finished");
    }
}
