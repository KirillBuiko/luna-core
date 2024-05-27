import type {NarrowedDestination} from "@/types/Types";
import type {NarrowedSource} from "@/types/Types";
import {ErrorMessage} from "@/utils/ErrorMessage";
import {Status} from "@grpc/grpc-js/build/src/constants";
import {AbstractPipe} from "@/pipe-builder/pipes/AbstractPipe";

type S = "REST_API";
type D = "REST_API";

export class RestToRestPipe extends AbstractPipe<S, D> {
    protected pipeGet(sourceOptions: NarrowedSource<S, "GET">,
                      destOptions: NarrowedDestination<D, "GET">) {
        const {sourceWriter} = sourceOptions;
        const {destReader} = destOptions;
        if (!(destReader && sourceWriter)) return;
        destReader.then((value) => {
            sourceWriter(null, value);
        }).catch(err => {
            this.pipeErrorHandler.sourceErrorEmit(sourceOptions,
                ErrorMessage.create(Status.ABORTED, err));
        })
    }

    protected pipeSet(sourceOptions: NarrowedSource<S, "SET">,
                      destOptions: NarrowedDestination<D, "SET">) {
        const {sourceWriter, sourceReader} = sourceOptions;
        const {destWriter, destReader} = destOptions;
        if (sourceReader && destWriter) {
            sourceReader
                .on("data", data => {
                    destWriter.write(data)
                })
                .on("end", () => {
                    destWriter.end()
                })
                .on("error", err => {
                    this.pipeErrorHandler.destinationErrorEmit(destOptions,
                        ErrorMessage.create(Status.ABORTED, err));
                });
        }

        destReader!.then(data => {
            sourceWriter!(null, data);
        }).catch(err => {
            this.pipeErrorHandler.sourceErrorEmit(sourceOptions,
                ErrorMessage.create(Status.ABORTED, err));
        })
    }
}
