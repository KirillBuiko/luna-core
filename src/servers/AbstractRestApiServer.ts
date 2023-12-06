import type {IAbstractServer} from "@/app/types/IServer";
import type {ServerStatus} from "@/app/types/IServer";
import Fastify, {RouteHandlerMethod} from "fastify";
import {fastifyMultipart} from "@fastify/multipart";
import type {ServerConfigType} from "@/app/types/ServerConfigType";

export abstract class AbstractRestApiServer implements IAbstractServer{
    status: ServerStatus = "off";
    server = Fastify();

    protected constructor() {
        this.server.register(fastifyMultipart, {
            limits: {
                fileSize: 1024 * 1024 * 1024
            }
        }).then(() => {
            this.server.get('/get', this.getHandler.bind(this));
            this.server.post('/set', this.setHandler.bind(this));
        })
        // this.server.register(fStat, {
        //     root: swagger.absolutePath(),
        //     // prefix: "/swagger",
        //     logLevel: "info"
        // })
    }

    async startDefault(config: ServerConfigType): Promise<Error | null> {
        try {
            await this.server.listen({
                port: config.port
            });
        } catch (err) {
            return err as Error;
        }
        this.status = "on";
        return null;
    }

    stop(): Promise<Error | undefined> {
        this.status = "off";
        return this.server.close();
    }

    protected abstract getHandler: RouteHandlerMethod;

    protected abstract setHandler: RouteHandlerMethod;
}