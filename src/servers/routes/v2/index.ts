import type {FastifyInstance} from "fastify";
import type {IRequestManager} from "@/request-manager/types/IRequestManager";

export function getV2Router(requestManager: IRequestManager) {
    return (fastify: FastifyInstance, opts, done) => {
        done()
    }
}
