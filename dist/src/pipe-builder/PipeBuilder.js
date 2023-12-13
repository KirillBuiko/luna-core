"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipeBuilder = void 0;
const RestToGrpcPipe_1 = require("@/pipe-builder/RestToGrpcPipe");
const GrpcToGrpcPipe_1 = require("@/pipe-builder/GrpcToGrpcPipe");
const ErrorMessage_1 = require("@/utils/ErrorMessage");
const PipeErrorHandler_1 = require("@/pipe-builder/PipeErrorHandler");
const constants_1 = require("@grpc/grpc-js/build/src/constants");
const RestToRestPipe_1 = require("@/pipe-builder/RestToRestPipe");
const GrpcToRestPipe_1 = require("@/pipe-builder/GrpcToRestPipe");
class PipeBuilder {
    buildPipe(sourceOptions, destOptions) {
        if (sourceOptions.protocol == "REST_API" && destOptions.protocol === "GRPC") {
            (new RestToGrpcPipe_1.RestToGrpcPipe()).handle(sourceOptions, destOptions);
        }
        else if (sourceOptions.protocol == "GRPC" && destOptions.protocol === "GRPC") {
            (new GrpcToGrpcPipe_1.GrpcToGrpcPipe()).handle(sourceOptions, destOptions);
        }
        else if (sourceOptions.protocol == "REST_API" && destOptions.protocol === "REST_API") {
            (new RestToRestPipe_1.RestToRestPipe()).handle(sourceOptions, destOptions);
        }
        else if (sourceOptions.protocol == "GRPC" && destOptions.protocol === "REST_API") {
            (new GrpcToRestPipe_1.GrpcToRestPipe()).handle(sourceOptions, destOptions);
        }
        else {
            (new PipeErrorHandler_1.PipeErrorHandler()).bothErrorEmit(sourceOptions, destOptions, ErrorMessage_1.ErrorMessage.create(constants_1.Status.UNAVAILABLE, "Protocols pair or method is not supporting"));
        }
    }
}
exports.PipeBuilder = PipeBuilder;
