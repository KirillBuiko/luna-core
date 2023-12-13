"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndpointsManager = void 0;
const index_1 = require("./index");
class EndpointsManager {
    getEndpoint(endpointName) {
        return index_1.endpoints[endpointName];
    }
    async initAll(configs) {
        console.log("Endpoints are initiating");
        const promises = Object.keys(index_1.endpoints).map(async (endpointName) => {
            const endpoint = index_1.endpoints[endpointName];
            const config = configs[endpointName];
            try {
                const err = await endpoint.init(config);
                if (err) {
                    console.log(`The endpoint "${endpointName}" init attempt failed with error: ${err.message}`);
                }
                else {
                    console.log(`The endpoint "${endpointName}" connected to host ${config.host}`);
                }
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        });
        await Promise.allSettled(promises);
        console.log("Endpoints init finished");
    }
}
exports.EndpointsManager = EndpointsManager;
