import {AbstractRestApiServer} from "@/servers/AbstractRestApiServer";
import type {
    RouteHandlerMethod
} from "fastify";

export class TestRestApiServer extends AbstractRestApiServer {
    constructor() {
        super();
    }

    protected getHandler: RouteHandlerMethod = (req, res) => {
        return undefined;
    }

    protected setHandler: RouteHandlerMethod = (req, res) => {
        return undefined;
    }
}
