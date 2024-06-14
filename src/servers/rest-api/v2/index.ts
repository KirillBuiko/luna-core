import type {FastifyInstance} from "fastify";
import type {IRequestManager} from "@/request-manager/types/IRequestManager";
import {codeFragmentRouteDescriptors} from "@/servers/rest-api/v2/codeFragmentStorage";
import {V2RestApiActions} from "@/servers/rest-api/v2/V2RestApiActions";

export function getV2Router(requestManager: IRequestManager) {
    const actions = V2RestApiActions(requestManager);

    return (fastify: FastifyInstance, opts, done) => {
        [...codeFragmentRouteDescriptors].forEach(desc => {
            fastify.route({
                method: desc.http[0],
                url: actions.getURL(desc),
                handler: actions.getRouteHandler(desc)
            });
        })
        done()
    }
}
