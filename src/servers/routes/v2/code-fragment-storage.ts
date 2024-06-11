import type {FastifyInstance, FastifyRequest} from "fastify";
import type {FastifyReply} from "fastify";
import type {RequestManager} from "@/request-manager/RequestManager";
import FormData from "form-data";
import {Status} from "@grpc/grpc-js/build/src/constants";
import type {MultipartTransferObject} from "@/types/Types";

// Define:
// - method + url
// - requestType + method
// - query + params -> info
// - success status type
// - error status type
// - ? unique reader handler
// - ? content-type

export function setCodeFragmentStorageRoutes(requestManager: RequestManager, fastify: FastifyInstance) {
    fastify.get('/code-f-storage/code-f/:valueId', (req: FastifyRequest, res: FastifyReply) => {
        requestManager.register({
            protocol: "REST_API",
            requestName: "GET",
            sourceWriter: (error, value: MultipartTransferObject) => {
                if (error) {
                    return this.sendError(res, Status.ABORTED, error);
                } else {
                    const formData = new FormData();
                    formData.append("info", JSON.stringify(value.info.codeF?.value), {
                        contentType: "application/json"
                    });
                    if (value && value.data) {
                        formData.append("data", value.data);
                    }
                    res.headers(formData.getHeaders()).send(formData);
                }
            }
        }, {
            requestType: "CODE_F",
            infoType: "codeFGet",
            codeFGet: {
                id: (req.params as any)?.id
            }
        })
    });
    // fastify.post('/set', actions.setHandler.bind(actions));
}
