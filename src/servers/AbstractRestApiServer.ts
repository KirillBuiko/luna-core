import type {IAbstractServer} from "@/app/types/IServer";
import type {ServerStatus} from "@/app/types/IServer";
import Fastify, {RouteHandlerMethod} from "fastify";
import type {ServerConfigType} from "@/app/types/ServerConfigType";
import {configs} from "../../configs/configs";

export abstract class AbstractRestApiServer implements IAbstractServer {
    status: ServerStatus = "off";
    server = Fastify();

    protected constructor() {
        this.server.register(require('@fastify/multipart'), {
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
        }).then(() => {
            this.server.post('/api/v1/get', this.getHandler.bind(this));
            this.server.post('/api/v1/set', this.setHandler.bind(this));
            // this.server.post('/*', this.debugHandler.bind(this));
        });
    }

    async defaultStart(config: ServerConfigType): Promise<Error | null> {
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

    protected abstract getHandler: RouteHandlerMethod;

    protected abstract setHandler: RouteHandlerMethod;

    protected abstract debugHandler: RouteHandlerMethod;
}
