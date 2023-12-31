import type {
    DestinationOptionsType,
    SourceOptionsType
} from "@/types/Types";
import {RestToGrpcPipe} from "@/pipe-builder/RestToGrpcPipe";
import {GrpcToGrpcPipe} from "@/pipe-builder/GrpcToGrpcPipe";
import {ErrorMessage} from "@/utils/ErrorMessage";
import {PipeErrorHandler} from "@/pipe-builder/PipeErrorHandler";
import {Status} from "@grpc/grpc-js/build/src/constants";
import {RestToRestPipe} from "@/pipe-builder/RestToRestPipe";
import {GrpcToRestPipe} from "@/pipe-builder/GrpcToRestPipe";

export class PipeBuilder {
    buildPipe<SourceRequestT, SourceResponseT>
    (sourceOptions: SourceOptionsType,
     destOptions: DestinationOptionsType) {
        if (sourceOptions.protocol == "REST_API" && destOptions.protocol === "GRPC") {
            (new RestToGrpcPipe()).handle(sourceOptions, destOptions);
        } else if (sourceOptions.protocol == "GRPC" && destOptions.protocol === "GRPC") {
            (new GrpcToGrpcPipe()).handle(sourceOptions, destOptions);
        } else if (sourceOptions.protocol == "REST_API" && destOptions.protocol === "REST_API") {
            (new RestToRestPipe()).handle(sourceOptions, destOptions);
        } else if (sourceOptions.protocol == "GRPC" && destOptions.protocol === "REST_API") {
            (new GrpcToRestPipe()).handle(sourceOptions, destOptions);
        } else {
            (new PipeErrorHandler()).bothErrorEmit(sourceOptions, destOptions,
                ErrorMessage.create(Status.UNAVAILABLE, "Protocols pair or method is not supporting"));
        }
    }
}
