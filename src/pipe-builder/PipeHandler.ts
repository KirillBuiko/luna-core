import type {
    DestinationOptionsType,
    SourceOptionsType
} from "@/types/Types";
import {Status} from "@grpc/grpc-js/build/src/constants";
import {PipeErrorHandler} from "@/pipe-builder/PipeErrorHandler";
import {ErrorMessage} from "@/utils/ErrorMessage";

export abstract class PipeHandler<SourceOT extends SourceOptionsType, DestOT extends DestinationOptionsType> {
    pipeErrorHandler = new PipeErrorHandler();

    handle(sourceOptions: SourceOT,
           destOptions: DestOT) {
        if ((sourceOptions.writer && !destOptions.destReader) ||
            (!sourceOptions.writer && destOptions.destReader) ||
            (sourceOptions.sourceReader && !destOptions.destWriter) ||
            (!sourceOptions.sourceReader && destOptions.destWriter)) {
            this.pipeErrorHandler.bothErrorEmit(sourceOptions, destOptions,
                ErrorMessage.create(Status.UNAVAILABLE, "Error in routing or endpoint is not available"));
            return;
        }
        if (sourceOptions.requestName === "GET" && destOptions.requestName == "GET") {
            this.getHandler(sourceOptions, destOptions);
        } else if (sourceOptions.requestName === "SET" && destOptions.requestName == "SET") {
            this.setHandler(sourceOptions, destOptions);
        }
    }

    protected abstract getHandler(sourceOptions: SourceOT,
                                  destOptions: DestOT);

    protected abstract setHandler(sourceOptions: SourceOT,
                                  destOptions: DestOT);
}
