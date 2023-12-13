"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServersManager = void 0;
const index_1 = require("./index");
class ServersManager {
    constructor() { }
    async startAll(configs, requestManager) {
        console.log("Servers are starting");
        const promises = Object.keys(index_1.servers).map(async (serverName) => {
            const server = index_1.servers[serverName];
            const config = configs[serverName];
            const err = await server.start(config, requestManager);
            if (err) {
                console.log(`The server "${serverName}" start attempt failed with error: ${err.message}`);
                throw err;
            }
            else {
                console.log(`The server "${serverName}" started on port ${config.port}`);
            }
        });
        try {
            await Promise.all(promises);
            console.log("Servers start finished");
        }
        catch (err) {
            console.log("Servers start aborted");
            throw err;
        }
    }
    stopAll() {
        const promises = Object.keys(index_1.servers).map(async (serverName) => {
            const server = index_1.servers[serverName];
            if (server.status !== "on")
                return;
            const res = await server.stop();
            if (res) {
                console.log(`The server "${serverName}" stop attempt failed with error: ${res.message}`);
            }
            else {
                console.log(`The server "${serverName}" stopped`);
            }
        });
        return Promise.allSettled(promises);
    }
}
exports.ServersManager = ServersManager;
