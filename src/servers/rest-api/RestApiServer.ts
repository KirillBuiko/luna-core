import type {IServer} from "@/app/types/ICoreServer";
import type {ServerConfigType} from "@/app/types/ServerConfigType";
import type {IRequestManager} from "@/request-manager/types/IRequestManager";
import {configs} from "../../../configs/configs";
import type {ServerStatus} from "@/app/types/ICoreServer";
import Fastify from "fastify";
import cors from "@fastify/cors";
import {getV1Router} from "@/servers/rest-api/v1";
import {getV2Router} from "@/servers/rest-api/v2";
import type {IServerDependencies} from "@/app/types/IServerDependencies";

export class RestApiServer implements IServer {
    requestManager: IRequestManager | undefined;
    status: ServerStatus = "off";
    server = Fastify();

    constructor() {
        this.server.register(cors, {
            origin: true
        }).register(require('@fastify/multipart'), {
            limits: {
                fileSize: 10_000_000_000
            }
        }).register(require('@fastify/http-proxy'), {
            upstream: configs.UI_HOST,
            prefix: "/ui",
            rewritePrefix: "/"
        }).register(require('@fastify/http-proxy'), {
            upstream: configs.UI_HOST,
            prefix: "/static",
            rewritePrefix: "/static"
        });
    }

    async start(config: ServerConfigType, deps: IServerDependencies): Promise<Error | null> {
        this.server.register(getV1Router(deps.requestsManager), {prefix: "/api/v1"});
        this.server.register(getV2Router(deps.requestsManager), {prefix: "/api/v2"});
        this.requestManager = deps.requestsManager;
        try {
            await this.server.listen({
                port: config.port,
                host: config.host
            });
        } catch (err) {
            return err as Error;
        }
        this.status = "on";
        return null;
    }

    async stop(): Promise<Error | undefined> {
        if (this.status == "off") return;
        this.status = "off";
        return this.server.close();
    }
}
