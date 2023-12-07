import type {
    DestinationOptionsType,
    SourceOptionsType
} from "@/types/Types";

export class PipelineBuilderClass {
    buildPipeline<SourceRequestT, SourceResponseT>
    (sourceOptions: SourceOptionsType,
     destOptions: DestinationOptionsType) {
        if (destOptions.protocol === "GRPC") {

        }
    }
}
