import type {
    DestinationOptionsType, ProtocolType,
    SourceOptionsType
} from "@/types/Types";
import {ErrorMessage} from "@/utils/ErrorMessage";
import {PipeErrorHandler} from "@/pipe-builder/PipeErrorHandler";
import {RestToRestPipe} from "@/pipe-builder/pipes/RestToRestPipe";
import type {AbstractPipe} from "@/pipe-builder/pipes/AbstractPipe";
import type {IPipeBuilder} from "@/request-manager/types/IPipeBuilder";
import {ErrorDto} from "@/endpoints/ErrorDto";

export class PipeBuilder implements IPipeBuilder {
    pipeHandlers: {
        [source in ProtocolType]: { [dest in ProtocolType]?: new () => AbstractPipe<source, dest> }
    } = {
        "REST_API": {
            "REST_API": RestToRestPipe,
            // "GRPC": RestToGrpcPipe,
        },
        "GRPC": {
            // "REST_API": GrpcToRestPipe,
            // "GRPC": GrpcToGrpcPipe,
        }
    }

    buildPipe(sourceOptions: SourceOptionsType, destOptions: DestinationOptionsType) {
        const [source, dest] = [sourceOptions.protocol, destOptions.protocol];
        const PipeConstructor = this.pipeHandlers[source] && this.pipeHandlers[source][dest];
        if (PipeConstructor) {
            (new PipeConstructor() as AbstractPipe).buildPipe(sourceOptions, destOptions);
        } else {
            (new PipeErrorHandler()).bothErrorEmit(sourceOptions, destOptions,
                ErrorMessage.create(
                    new ErrorDto("not-supported", "Protocols pair or method is not supported")));
        }
    }
}
