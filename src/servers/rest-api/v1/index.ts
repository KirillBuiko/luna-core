import type {FastifyInstance} from "fastify";
import type {IRequestManager} from "@/request-manager/types/IRequestManager";
import {V1RestApiActions} from "@/servers/rest-api/v1/V1RestApiActions";

export function getV1Router(requestManager: IRequestManager) {
    const actions = V1RestApiActions(requestManager);

    return (fastify: FastifyInstance, opts, done) => {
        fastify.post('/get', actions.getHandler.bind(actions));
        fastify.post('/set', actions.setHandler.bind(actions));
        done()
    }
}
