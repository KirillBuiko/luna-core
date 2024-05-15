import Fastify from "fastify";

export class FetchNetworkException extends Fastify.errorCodes.FST_ERR_BAD_URL {
    code = "";
    error = "";
    message = "";

    constructor() {
        super();
    }
}
