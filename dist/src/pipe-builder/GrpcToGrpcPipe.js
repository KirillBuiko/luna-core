"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrpcToGrpcPipe = void 0;
const ErrorMessage_1 = require("@/utils/ErrorMessage");
const constants_1 = require("@grpc/grpc-js/build/src/constants");
const PipeHandler_1 = require("@/pipe-builder/PipeHandler");
class GrpcToGrpcPipe extends PipeHandler_1.PipeHandler {
    getHandler(sourceOptions, destOptions) {
        const { writer } = sourceOptions;
        const { destReader } = destOptions;
        destReader
            .on("data", (data) => writer.write(data))
            .on("end", () => writer.end())
            .on("error", err => this.pipeErrorHandler.sourceErrorEmit(sourceOptions, ErrorMessage_1.ErrorMessage.create(constants_1.Status.ABORTED, JSON.stringify(err))));
    }
    setHandler(sourceOptions, destOptions) {
        const { writer, sourceReader } = sourceOptions;
        const { destWriter, destReader } = destOptions;
        sourceReader
            .on("data", (data) => destWriter.write(data))
            .on("error", err => this.pipeErrorHandler.destinationErrorEmit(destOptions, ErrorMessage_1.ErrorMessage.create(constants_1.Status.ABORTED, JSON.stringify(err))))
            .on("end", () => destWriter.end());
        destReader.then(data => {
            writer(null, data);
        }).catch(err => {
            this.pipeErrorHandler.sourceErrorEmit(destOptions, ErrorMessage_1.ErrorMessage.create(constants_1.Status.ABORTED, JSON.stringify(err)));
        });
    }
}
exports.GrpcToGrpcPipe = GrpcToGrpcPipe;
