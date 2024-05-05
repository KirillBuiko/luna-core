import type {
    DestinationOptionsType, ProtocolType,
    SourceOptionsType
} from "@/types/Types";
import {RestToGrpcPipe} from "@/pipe-builder/pipes/RestToGrpcPipe";
import {GrpcToGrpcPipe} from "@/pipe-builder/pipes/GrpcToGrpcPipe";
import {ErrorMessage} from "@/utils/ErrorMessage";
import {PipeErrorHandler} from "@/pipe-builder/PipeErrorHandler";
import {Status} from "@grpc/grpc-js/build/src/constants";
import {RestToRestPipe} from "@/pipe-builder/pipes/RestToRestPipe";
import {GrpcToRestPipe} from "@/pipe-builder/pipes/GrpcToRestPipe";
import type {AbstractPipe} from "@/pipe-builder/pipes/AbstractPipe";
import type {IPipeBuilder} from "@/request-manager/types/IPipeBuilder";

export class PipeBuilder implements IPipeBuilder {
    pipeHandlers: {
        [source in ProtocolType]: { [dest in ProtocolType]: new () => AbstractPipe<source, dest> }
    } = {
        "REST_API": {
            "REST_API": RestToRestPipe,
            "GRPC": RestToGrpcPipe,
        },
        "GRPC": {
            "REST_API": GrpcToRestPipe,
            "GRPC": GrpcToGrpcPipe,
        }
    }

    buildPipe(sourceOptions: SourceOptionsType, destOptions: DestinationOptionsType) {
        const [source, dest] = [sourceOptions.protocol, destOptions.protocol];
        const PipeConstructor = this.pipeHandlers[source] && this.pipeHandlers[source][dest];
        if (PipeConstructor) {
            (new PipeConstructor() as AbstractPipe).buildPipe(sourceOptions, destOptions);
        } else {
            (new PipeErrorHandler()).bothErrorEmit(sourceOptions, destOptions,
                ErrorMessage.create(Status.UNAVAILABLE, "Protocols pair or method is not supporting"));
        }
    }
}
