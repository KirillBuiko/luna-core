import type {IServer} from "@/app/types/ICoreServer";
import type {ServerConfigType} from "@/app/types/ServerConfigType";
import type {RouteHandlerMethod} from "fastify";
import type {IRequestManager} from "@/request-manager/types/IRequestManager";
import {RestApiActions} from "@/servers/actions/RestApiActions";
import {configs} from "../../configs/configs";
import type {ServerStatus} from "@/app/types/ICoreServer";
import Fastify from "fastify";

export class RestApiServer implements IServer {
    requestManager: IRequestManager | undefined;
    restApiActions: RestApiActions;
    status: ServerStatus = "off";
    server = Fastify();

    constructor() {
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

    async start(config: ServerConfigType, requestManager: IRequestManager): Promise<Error | null> {
        this.requestManager = requestManager;
        this.restApiActions = new RestApiActions(requestManager);
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

    protected getHandler: RouteHandlerMethod = (req, res) => {
        return this.restApiActions.getHandler(req, res);
    }

    protected setHandler: RouteHandlerMethod = async (req, res) => {
        return this.restApiActions.setHandler(req, res);
    }

    protected debugHandler: RouteHandlerMethod = async (req, res) => {
        return this.restApiActions.debugHandler(req, res);
    }
}
