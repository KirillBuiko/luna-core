import type {IServer} from "@/app/types/IServer";
import type {ServerConfigType} from "@/app/types/ServerConfigType";
import type {RouteHandlerMethod} from "fastify";
import type {IRequestManager} from "@/app/types/IRequestManager";
import {AbstractRestApiServer} from "@/servers/AbstractRestApiServer";

export class RestApiServer extends AbstractRestApiServer implements IServer {
    requestManager: IRequestManager | undefined;

    constructor() {
        super();
    }

    async start(config: ServerConfigType, requestManager: IRequestManager): Promise<Error | null> {
        this.requestManager = requestManager;
        return super.startDefault(config);
    }

    stop(): Promise<Error | undefined> {
        this.status = "off";
        return this.server.close();
    }

    protected getHandler: RouteHandlerMethod = (req, res) => {
        console.log(req.query);
        // this.requestManager!.register({
        //     protocol: ProtocolType.REST_API,
        //     requestName: RequestName.GET,
        //     sourceWriter: res,
        // }, (JSON.parse(req.query as string) as RestApiQueryType).info);
    }

    protected setHandler: RouteHandlerMethod = (req, res) => {

    }
}