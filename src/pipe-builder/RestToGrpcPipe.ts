import type {NarrowedDestinationOptionsType} from "@/types/Types";
import type {NarrowedSourceOptionsType, RequestName} from "@/types/Types";
import {ErrorMessage} from "@/utils/ErrorMessage";
import {Status} from "@grpc/grpc-js/build/src/constants";
import type {DataStream__Output} from "@grpc-build/DataStream";
import {PipeHandler} from "@/pipe-builder/PipeHandler";


type SourceOptions<RequestN extends RequestName = RequestName> =
    NarrowedSourceOptionsType<"REST_API", RequestN>;
type DestinationOptions<RequestN extends RequestName = RequestName> =
    NarrowedDestinationOptionsType<"GRPC", RequestN>;

export class RestToGrpcPipe extends PipeHandler<SourceOptions, DestinationOptions> {
    protected getHandler(sourceOptions: SourceOptions<"GET">, destOptions: DestinationOptions<"GET">) {
        const {sourceWriter} = sourceOptions;
        const {destReader} = destOptions;

        // TODO: support it
        // destReader
        //     .on("data", (data: DataStream__Output) =>
        //         data.infoOrData == "info"
        //             ? sourceWriter.write(JSON.stringify(data.info))
        //             : sourceWriter.write(data.chunkData))
        //     .on("end", () =>
        //         sourceWriter.end())
        //     .on("error", err => {
        //         this.pipeErrorHandler.sourceErrorEmit(sourceOptions,
        //             ErrorMessage.create(Status.ABORTED, JSON.stringify(err)));
        //     });
    }

    protected setHandler(sourceOptions: SourceOptions<"SET">, destOptions: DestinationOptions<"SET">) {
        const {sourceWriter, sourceReader} = sourceOptions;
        const {destWriter, destReader} = destOptions;

        // TODO: support it
        // sourceReader
        //     .on("data", data => destWriter.write({chunkData: data}))
        //     .on("end", () => destWriter.end())
        //     .on("error", err => {
        //         this.pipeErrorHandler.destinationErrorEmit(destOptions,
        //             ErrorMessage.create(Status.ABORTED, JSON.stringify(err)));
        //     });
        //
        // destReader.then(data => {
        //     sourceWriter(null, data);
        // }).catch(err => {
        //     this.pipeErrorHandler.sourceErrorEmit(sourceOptions,
        //         ErrorMessage.create(Status.ABORTED, JSON.stringify(err)));
        // })
    }
}
