import type {
    DestinationOptionsType,
    SourceOptionsType
} from "@/types/Types";
import {ProtocolType} from "@/types/Enums";

export class PipelineBuilderClass {
    buildPipeline<SourceRequestT, SourceResponseT>
    (sourceOptions: SourceOptionsType,
     destOptions: DestinationOptionsType) {
        if (destOptions.protocol === ProtocolType.GRPC) {

        }
    }
}
