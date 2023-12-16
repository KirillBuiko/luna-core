import type {DestinationOptionsType, SourceOptionsType} from "@/types/Types";
import type {ServerErrorResponse} from "@grpc/grpc-js/build/src/server-call";

export class PipeErrorHandler {
    sourceErrorEmit(sourceOptions: SourceOptionsType, error: ServerErrorResponse) {
        switch (typeof sourceOptions.sourceWriter) {
            case "object":
                sourceOptions.sourceWriter.destroy && sourceOptions.sourceWriter.destroy(error);
                break;
            case "function":
                sourceOptions.sourceWriter(error)
                break;
        }
        // if (sourceOptions.protocol == "GRPC" && sourceOptions.requestName == "GET") {
        //     sourceOptions.sourceWriter && sourceOptions.sourceWriter.destroy(error);
        // } else if (sourceOptions.protocol == "GRPC" && sourceOptions.requestName == "SET") {
        //     sourceOptions.sourceWriter && sourceOptions.sourceWriter(error);
        //     sourceOptions.sourceReader && sourceOptions.sourceReader.destroy(error);
        // } else if (sourceOptions.protocol == "REST_API" && sourceOptions.requestName == "GET") {
        //     sourceOptions.sourceWriter && sourceOptions.sourceWriter.destroy(error);
        // } else if (sourceOptions.protocol == "REST_API" && sourceOptions.requestName == "SET") {
        //     sourceOptions.sourceWriter && sourceOptions.sourceWriter(error);
        //     sourceOptions.sourceReader && sourceOptions.sourceReader.destroy(error);
        // }
    }

    destinationErrorEmit(destOptions: DestinationOptionsType, error: ServerErrorResponse) {
        if (typeof destOptions.destReader == "object" && "destroy" in destOptions.destReader) {
            destOptions.destReader.destroy(error);
        }
        if (typeof destOptions.destWriter == "object" && "destroy" in destOptions.destWriter) {
            destOptions.destWriter.destroy(error);
        }
        // if (destOptions.protocol == "GRPC" && destOptions.requestName == "GET") {
        //     destOptions.destReader && destOptions.destReader.destroy(error);
        // } else if (destOptions.protocol == "GRPC" && destOptions.requestName == "SET") {
        //     destOptions.destWriter && destOptions.destWriter.destroy(error);
        // } else if (destOptions.protocol == "REST_API" && destOptions.requestName == "GET") {
        //     destOptions.destReader && destOptions.destReader.destroy(error);
        // } else if (destOptions.protocol == "REST_API" && destOptions.requestName == "SET") {
        //     destOptions.destWriter && destOptions.destWriter.destroy(error);
        // }
    }

    bothErrorEmit(sourceOptions: SourceOptionsType,
                  destOptions: DestinationOptionsType,
                  error: ServerErrorResponse) {
        this.sourceErrorEmit(sourceOptions, error);
        this.destinationErrorEmit(destOptions, error);
    }
}