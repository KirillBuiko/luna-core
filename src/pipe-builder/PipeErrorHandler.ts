import type {DestinationOptionsType, SourceOptionsType} from "@/types/general";
import type {ErrorDto} from "@/endpoints/ErrorDto";
import {PlainErrorDto} from "@/endpoints/ErrorDto";

export class PipeErrorHandler {
    sourceErrorEmit(sourceOptions: SourceOptionsType, error: ErrorDto) {
        switch (typeof sourceOptions.sourceWriter) {
            case "object":
                sourceOptions.sourceWriter.destroy && sourceOptions.sourceWriter.destroy(new PlainErrorDto(error));
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

    destinationErrorEmit(destOptions: DestinationOptionsType, error: ErrorDto) {
        if (typeof destOptions.destReader == "object" && "destroy" in destOptions.destReader) {
            destOptions.destReader.destroy(new PlainErrorDto(error));
        }
        if (typeof destOptions.destWriter == "object" && "destroy" in destOptions.destWriter) {
            destOptions.destWriter.destroy(new PlainErrorDto(error));
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
                  error: ErrorDto) {
        this.sourceErrorEmit(sourceOptions, error);
        this.destinationErrorEmit(destOptions, error);
    }
}
