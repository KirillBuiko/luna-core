import type {
    DestinationOptionsType,
    SourceOptionsType
} from "@/types/Types";
import {RestToGrpcPipe} from "@/pipe-builder/RestToGrpcPipe";
import {GrpcToGrpcPipe} from "@/pipe-builder/GrpcToGrpcPipe";

export class PipeBuilder {
    buildPipeline<SourceRequestT, SourceResponseT>
    (sourceOptions: SourceOptionsType,
     destOptions: DestinationOptionsType) {
        if (sourceOptions.protocol == "REST_API" && destOptions.protocol === "GRPC") {
            (new RestToGrpcPipe()).handle(sourceOptions, destOptions);
        } else if (sourceOptions.protocol == "GRPC" && destOptions.protocol === "GRPC") {
            (new GrpcToGrpcPipe()).handle(sourceOptions, destOptions);
        }
    }
}
