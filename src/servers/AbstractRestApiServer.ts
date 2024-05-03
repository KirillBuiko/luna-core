import type {IAbstractServer} from "@/app/types/IServer";
import type {ServerStatus} from "@/app/types/IServer";
import Fastify, {RouteHandlerMethod} from "fastify";
import type {ServerConfigType} from "@/app/types/ServerConfigType";

export abstract class AbstractRestApiServer implements IAbstractServer {
    status: ServerStatus = "off";
    server = Fastify();

    protected constructor() {
        this.server.register(require('@fastify/multipart')).then(() => {
            this.server.get('/get', this.getHandler.bind(this));
            this.server.post('/set', this.setHandler.bind(this));
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
}
