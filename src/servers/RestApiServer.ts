import type {IServer, ServerStatus} from "@/app/types/IServer";
import type {ServerConfigType} from "@/app/types/ServerConfigType";
import Fastify, {type RouteHandlerMethod} from "fastify";
import {fastifyMultipart} from "@fastify/multipart";
import type {IRequestManager} from "@/app/types/IRequestManager";
import {ProtocolType, RequestName} from "@/types/Enums";
import type {RestApiQueryType} from "@/types/Types";

export class RestApiServer implements IServer {
    status: ServerStatus = "off";
    requestManager: IRequestManager | undefined;
    server = Fastify();

    constructor() {
        const Duplicate2 = this;
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

    async start(config: ServerConfigType, requestManager: IRequestManager): Promise<Error | null> {
        this.requestManager = requestManager;
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

    private getHandler: RouteHandlerMethod = (req, res) => {
        console.log(req.query);
        // this.requestManager!.register({
        //     protocol: ProtocolType.REST_API,
        //     requestName: RequestName.GET,
        //     sourceWriter: res,
        // }, (JSON.parse(req.query as string) as RestApiQueryType).info);
    }

    private setHandler: RouteHandlerMethod = (req, res) => {

    }
}