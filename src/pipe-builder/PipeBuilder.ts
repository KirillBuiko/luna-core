import type {
    DestinationOptionsType,
    SourceOptionsType
} from "@/types/Types";
import {RestToGrpcPipe} from "@/pipe-builder/RestToGrpcPipe";

export class PipeBuilder {
    buildPipeline<SourceRequestT, SourceResponseT>
    (sourceOptions: SourceOptionsType,
     destOptions: DestinationOptionsType) {
        if (sourceOptions.protocol == "REST_API" && destOptions.protocol === "GRPC") {
            (new RestToGrpcPipe()).handle(sourceOptions, destOptions);
        }
    }
}
