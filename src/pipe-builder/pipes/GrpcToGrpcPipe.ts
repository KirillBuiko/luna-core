import type {NarrowedDestination} from "@/types/Types";
import type {NarrowedSource, RequestName} from "@/types/Types";
import {ErrorMessage} from "@/utils/ErrorMessage";
import {Status} from "@grpc/grpc-js/build/src/constants";
import type {DataStream, DataStream__Output} from "@grpc-build/DataStream";
import {AbstractPipe} from "@/pipe-builder/pipes/AbstractPipe";

type S = "GRPC";
type D = "GRPC";

export class GrpcToGrpcPipe extends AbstractPipe<S, D> {
    protected pipeGet(sourceOptions: NarrowedSource<S, "GET">,
                      destOptions: NarrowedDestination<D, "GET">) {
        const {sourceWriter} = sourceOptions;
        const {destReader} = destOptions;
        if (!destReader) return;
        destReader
            .on("data", (data: DataStream__Output) =>
                sourceWriter!.write(data))
            .on("close", () =>
                sourceWriter!.destroy())
            .on("error", err =>
                this.pipeErrorHandler.sourceErrorEmit(sourceOptions,
                    ErrorMessage.create(Status.ABORTED, JSON.stringify(err))));
    }

    protected pipeSet(sourceOptions: NarrowedSource<S, "SET">,
                      destOptions: NarrowedDestination<D, "SET">) {
        const {sourceWriter, sourceReader} = sourceOptions;
        const {destWriter, destReader} = destOptions;
        if (!(destReader && destWriter && sourceWriter && sourceReader)) return;

        sourceReader
            .on("data", (data: DataStream) =>
                destWriter.write(data))
            .on("error", err =>
                this.pipeErrorHandler.destinationErrorEmit(destOptions,
                    ErrorMessage.create(Status.ABORTED, JSON.stringify(err))))
            .on("end", () => destWriter.end());

        destReader.then(data => {
            sourceWriter(null, data);
        }).catch(err => {
            this.pipeErrorHandler.sourceErrorEmit(sourceOptions,
                ErrorMessage.create(Status.ABORTED, JSON.stringify(err)));
        })
    }
}
