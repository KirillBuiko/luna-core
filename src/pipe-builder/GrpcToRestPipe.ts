import type {NarrowedDestinationOptionsType} from "@/types/Types";
import type {NarrowedSourceOptionsType, RequestName} from "@/types/Types";
import {ErrorMessage} from "@/utils/ErrorMessage";
import {Status} from "@grpc/grpc-js/build/src/constants";
import type {DataStream} from "@grpc-build/DataStream";
import {PipeHandler} from "@/pipe-builder/PipeHandler";


type SourceOptions<RequestN extends RequestName = RequestName> =
    NarrowedSourceOptionsType<"GRPC", RequestN>;
type DestinationOptions<RequestN extends RequestName = RequestName> =
    NarrowedDestinationOptionsType<"REST_API", RequestN>;

export class GrpcToRestPipe extends PipeHandler<SourceOptions, DestinationOptions> {
    protected getHandler(sourceOptions: SourceOptions<"GET">, destOptions: DestinationOptions<"GET">) {
        const {writer} = sourceOptions;
        const {destReader} = destOptions;
        destReader
            .on("data", (data) =>
                writer.write({chunkData: data}))
            .on("end", () =>
                writer.end())
            .on("error", err =>
                this.pipeErrorHandler.sourceErrorEmit(sourceOptions,
                    ErrorMessage.create(Status.ABORTED, JSON.stringify(err))));
    }

    protected setHandler(sourceOptions: SourceOptions<"SET">, destOptions: DestinationOptions<"SET">) {
        const {writer, sourceReader} = sourceOptions;
        const {destWriter, destReader} = destOptions;

        sourceReader
            .on("data", (data: DataStream) =>
                destWriter.write(data.chunkData))
            .on("error", err =>
                this.pipeErrorHandler.destinationErrorEmit(destOptions,
                    ErrorMessage.create(Status.ABORTED, JSON.stringify(err))))
            .on("end", () => destWriter.end());

        destReader.then(data => {
            writer(null, data);
        }).catch(err => {
            this.pipeErrorHandler.sourceErrorEmit(destOptions,
                ErrorMessage.create(Status.ABORTED, JSON.stringify(err)));
        })
    }
}