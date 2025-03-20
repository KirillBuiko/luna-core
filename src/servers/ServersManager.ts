import type {ServerConfigsType, ServerName} from "@/app/types/ServerConfigType";
import {servers} from "./index";
import type {IServersManager} from "@/app/types/IServersManager";
import type {IServerDependencies} from "@/app/types/IServerDependencies";
import {coreLogger} from "@/app/main";

export class ServersManager implements IServersManager {
    constructor() {}

    async startAll(configs: ServerConfigsType, deps: IServerDependencies) {
        coreLogger.info("Servers are starting");
        const promises = Object.keys(servers).map(async serverName => {
            const server = servers[serverName as ServerName];
            const config = configs[serverName as ServerName];
            const err = await server.start(config, deps);
            if (err) {
                coreLogger.info(`The server "${serverName}" start attempt failed with error: ${err.message}`);
                throw err;
            } else {
                coreLogger.info(`The server "${serverName}" started on port ${config.port}`);
            }
        });
        try {
            await Promise.all(promises);
            coreLogger.info("Servers start finished");
        } catch (err) {
            coreLogger.info("Servers start aborted");
            throw err;
        }
    }

    stopAll() {
        const promises = Object.keys(servers).map(async serverName => {
            const server = servers[serverName as ServerName];
            if (server.status !== "on") return;
            const res = await server.stop();
            if (res) {
                coreLogger.info(`The server "${serverName}" stop attempt failed with error: ${res.message}`);
            } else {
                coreLogger.info(`The server "${serverName}" stopped`);
            }
        });
        return Promise.allSettled(promises);
    }
}
