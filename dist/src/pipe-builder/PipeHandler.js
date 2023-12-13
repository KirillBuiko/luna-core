"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipeHandler = void 0;
const constants_1 = require("@grpc/grpc-js/build/src/constants");
const PipeErrorHandler_1 = require("@/pipe-builder/PipeErrorHandler");
const ErrorMessage_1 = require("@/utils/ErrorMessage");
class PipeHandler {
    pipeErrorHandler = new PipeErrorHandler_1.PipeErrorHandler();
    handle(sourceOptions, destOptions) {
        if ((sourceOptions.writer && !destOptions.destReader) ||
            (!sourceOptions.writer && destOptions.destReader) ||
            (sourceOptions.sourceReader && !destOptions.destWriter) ||
            (!sourceOptions.sourceReader && destOptions.destWriter)) {
            this.pipeErrorHandler.bothErrorEmit(sourceOptions, destOptions, ErrorMessage_1.ErrorMessage.create(constants_1.Status.UNAVAILABLE, "Error in routing or endpoint is not available"));
            return;
        }
        if (sourceOptions.requestName === "GET" && destOptions.requestName == "GET") {
            this.getHandler(sourceOptions, destOptions);
        }
        else if (sourceOptions.requestName === "SET" && destOptions.requestName == "SET") {
            this.setHandler(sourceOptions, destOptions);
        }
    }
}
exports.PipeHandler = PipeHandler;
