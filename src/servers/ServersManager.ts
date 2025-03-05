import type {ServerConfigsType, ServerName} from "@/app/types/ServerConfigType";
import {servers} from "./index";
import type {IServersManager} from "@/app/types/IServersManager";
import type {IServerDependencies} from "@/app/types/IServerDependencies";

export class ServersManager implements IServersManager {
    constructor() {}

    async startAll(configs: ServerConfigsType, deps: IServerDependencies) {
        console.log("Servers are starting");
        const promises = Object.keys(servers).map(async serverName => {
            const server = servers[serverName as ServerName];
            const config = configs[serverName as ServerName];
            const err = await server.start(config, deps);
            if (err) {
                console.log(`The server "${serverName}" start attempt failed with error: ${err.message}`);
                throw err;
            } else {
                console.log(`The server "${serverName}" started on port ${config.port}`);
            }
        });
        try {
            await Promise.all(promises);
            console.log("Servers start finished");
        } catch (err) {
            console.log("Servers start aborted");
            throw err;
        }
    }

    stopAll() {
        const promises = Object.keys(servers).map(async serverName => {
            const server = servers[serverName as ServerName];
            if (server.status !== "on") return;
            const res = await server.stop();
            if (res) {
                console.log(`The server "${serverName}" stop attempt failed with error: ${res.message}`);
            } else {
                console.log(`The server "${serverName}" stopped`);
            }
        });
        return Promise.allSettled(promises);
    }
}
