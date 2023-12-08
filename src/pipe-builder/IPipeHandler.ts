import type {
    DestinationOptionsType,
    SourceOptionsType
} from "@/types/Types";

export interface IPipeHandler {
    handle (sourceOptions: SourceOptionsType,
            destOptions: DestinationOptionsType);
}
