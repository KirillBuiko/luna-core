import type {
    NarrowedDestination, NarrowedSource, ProtocolType,
} from "@/types/Types";
import {Status} from "@grpc/grpc-js/build/src/constants";
import {PipeErrorHandler} from "@/pipe-builder/PipeErrorHandler";
import {ErrorMessage} from "@/utils/ErrorMessage";
import type {IPipeBuilder} from "@/request-manager/types/IPipeBuilder";

export abstract class AbstractPipe<S extends ProtocolType = ProtocolType, D extends ProtocolType = ProtocolType>
    implements IPipeBuilder<S, D> {
    pipeErrorHandler = new PipeErrorHandler();

    buildPipe(sourceOptions: NarrowedSource<S>,
              destOptions: NarrowedDestination<D>) {
        if ((Boolean(sourceOptions.sourceWriter) != Boolean(destOptions.destReader)) ||
            (Boolean(sourceOptions.sourceReader) != Boolean(destOptions.destWriter))) {
            this.pipeErrorHandler.bothErrorEmit(sourceOptions, destOptions,
                ErrorMessage.create(Status.UNAVAILABLE, "Error in routing or endpoint is not available"));
            return;
        }
        if (sourceOptions.requestName === "GET") {
            this.pipeGet(sourceOptions, destOptions);
        } else if (sourceOptions.requestName === "SET") {
            this.pipeSet(sourceOptions, destOptions);
        }
    }

    protected abstract pipeGet(sourceOptions: NarrowedSource<S>,
                               destOptions: NarrowedDestination<D>);

    protected abstract pipeSet(sourceOptions: NarrowedSource<S>,
                               destOptions: NarrowedDestination<D>);
}
