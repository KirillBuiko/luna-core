"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipeErrorHandler = void 0;
class PipeErrorHandler {
    sourceErrorEmit(sourceOptions, error) {
        if (sourceOptions.protocol == "GRPC" && sourceOptions.requestName == "GET") {
            sourceOptions.writer && sourceOptions.writer.destroy(error);
        }
        else if (sourceOptions.protocol == "GRPC" && sourceOptions.requestName == "SET") {
            sourceOptions.writer && sourceOptions.writer(error);
            sourceOptions.sourceReader && sourceOptions.sourceReader.destroy(error);
        }
        else if (sourceOptions.protocol == "REST_API" && sourceOptions.requestName == "GET") {
            sourceOptions.writer && sourceOptions.writer.destroy(error);
        }
        else if (sourceOptions.protocol == "REST_API" && sourceOptions.requestName == "SET") {
            sourceOptions.writer && sourceOptions.writer(error);
            sourceOptions.sourceReader && sourceOptions.sourceReader.destroy(error);
        }
    }
    destinationErrorEmit(destOptions, error) {
        if (destOptions.protocol == "GRPC" && destOptions.requestName == "GET") {
            destOptions.destReader && destOptions.destReader.destroy(error);
        }
        else if (destOptions.protocol == "GRPC" && destOptions.requestName == "SET") {
            destOptions.destWriter && destOptions.destWriter.destroy(error);
        }
        // else if (destOptions.protocol == "REST_API" && destOptions.requestName == "GET") {
        //
        // } else if (destOptions.protocol == "REST_API" && destOptions.requestName == "SET") {
        //
        // }
    }
    bothErrorEmit(sourceOptions, destOptions, error) {
        this.sourceErrorEmit(sourceOptions, error);
        this.destinationErrorEmit(destOptions, error);
    }
}
exports.PipeErrorHandler = PipeErrorHandler;
