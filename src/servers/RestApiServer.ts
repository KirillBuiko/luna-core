import type {IServer} from "@/app/types/IServer";
import type {ServerConfigType} from "@/app/types/ServerConfigType";
import type {RouteHandlerMethod} from "fastify";
import type {IRequestManager} from "@/app/types/IRequestManager";
import {AbstractRestApiServer} from "@/servers/AbstractRestApiServer";
import {RestApiActions} from "@/servers/actions/RestApiActions";

export class RestApiServer extends AbstractRestApiServer implements IServer {
    requestManager: IRequestManager | undefined;
    restApiActions: RestApiActions;

    constructor() {
        super();
    }

    async start(config: ServerConfigType, requestManager: IRequestManager): Promise<Error | null> {
        this.requestManager = requestManager;
        this.restApiActions = new RestApiActions(requestManager);
        return super.defaultStart(config);
    }

    stop(): Promise<Error | undefined> {
        this.status = "off";
        return this.server.close();
    }

    getHandler: RouteHandlerMethod = (req, res) => {
        return this.restApiActions.getHandler(req, res);
    }

    setHandler: RouteHandlerMethod = async (req, res) => {
        return this.restApiActions.setHandler(req, res);
    }
}
