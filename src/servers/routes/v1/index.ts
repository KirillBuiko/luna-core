import type {FastifyInstance} from "fastify";
import type {IRequestManager} from "@/request-manager/types/IRequestManager";
import {RestApiActions} from "@/servers/actions/RestApiActions";

export function getV1Router(requestManager: IRequestManager) {
    const actions = new RestApiActions(requestManager);

    return (fastify: FastifyInstance, opts, done) => {
        fastify.post('/get', actions.getHandler.bind(actions));
        fastify.post('/set', actions.setHandler.bind(actions));
        done()
    }
}
