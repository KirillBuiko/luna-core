"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestManager = void 0;
const RequestRouter_1 = require("@/request-manager/RequestRouter");
const PipeBuilder_1 = require("@/pipe-builder/PipeBuilder");
const PipeErrorHandler_1 = require("@/pipe-builder/PipeErrorHandler");
const ErrorMessage_1 = require("@/utils/ErrorMessage");
const constants_1 = require("@grpc/grpc-js/build/src/constants");
class RequestManager {
    endpointsManager;
    router = new RequestRouter_1.RequestRouter();
    pipeBuilder = new PipeBuilder_1.PipeBuilder();
    constructor(endpointsManager) {
        this.endpointsManager = endpointsManager;
    }
    register(sourceOptions, info) {
        let destOptions;
        const destName = this.router.getEndpointName(info.requestType, sourceOptions.requestName);
        console.log(`Request ${sourceOptions.requestName} of type ${info.requestType} ` +
            `from ${sourceOptions.protocol} to ${destName}`);
        if (destName) {
            try {
                destOptions = this.endpointsManager.getEndpoint(destName).send(sourceOptions.requestName, info);
            }
            catch (e) {
                console.log(`Failed to ${sourceOptions.requestName} ` +
                    `${info.requestType} from ${sourceOptions.protocol} to ${destName}`);
            }
        }
        if (!destName || !destOptions) {
            if (!destName) {
                (new PipeErrorHandler_1.PipeErrorHandler()).sourceErrorEmit(sourceOptions, ErrorMessage_1.ErrorMessage.create(constants_1.Status.UNAVAILABLE, "Couldn't find endpoint for request"));
                return;
            }
        }
        this.pipeBuilder.buildPipe(sourceOptions, destOptions);
    }
}
exports.RequestManager = RequestManager;
