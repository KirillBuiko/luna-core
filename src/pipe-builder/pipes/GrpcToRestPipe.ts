// import type {NarrowedDestination} from "@/types/Types";
// import type {NarrowedSource, RequestName} from "@/types/Types";
// import {ErrorMessage} from "@/utils/ErrorMessage";
// import {Status} from "@grpc/grpc-js/build/src/constants";
// import type {DataStream} from "@grpc-build/DataStream";
// import {AbstractPipe} from "@/pipe-builder/pipes/AbstractPipe";
//
// type S = "GRPC";
// type D = "REST_API";
//
// type SourceOptions<RequestN extends RequestName = RequestName> =
//     NarrowedSource<"GRPC", RequestN>;
// type DestinationOptions<RequestN extends RequestName = RequestName> =
//     NarrowedDestination<"REST_API", RequestN>;
//
// export class GrpcToRestPipe extends AbstractPipe<S, D> {
//     protected pipeGet(sourceOptions: NarrowedSource<S, "GET">,
//                       destOptions: NarrowedDestination<D, "GET">) {
//         const {sourceWriter} = sourceOptions;
//         const {destReader} = destOptions;
//
//         // TODO: support it
//         // destReader
//         //     .on("data", (data) =>
//         //         sourceWriter.write({chunkData: data}))
//         //     .on("end", () =>
//         //         sourceWriter.end())
//         //     .on("error", err =>
//         //         this.pipeErrorHandler.sourceErrorEmit(sourceOptions,
//         //             ErrorMessage.create(Status.ABORTED, JSON.stringify(err))));
//     }
//
//     protected pipeSet(sourceOptions: NarrowedSource<S, "SET">,
//                       destOptions: NarrowedDestination<D, "SET">) {
//         const {sourceWriter, sourceReader} = sourceOptions;
//         const {destWriter, destReader} = destOptions;
//
//         // TODO: support it
//         // sourceReader
//         //     .on("data", (data: DataStream) =>
//         //         destWriter.write(data.chunkData))
//         //     .on("error", err =>
//         //         this.pipeErrorHandler.destinationErrorEmit(destOptions,
//         //             ErrorMessage.create(Status.ABORTED, JSON.stringify(err))))
//         //     .on("end", () => destWriter.end());
//         //
//         // destReader.then(data => {
//         //     sourceWriter(null, data);
//         // }).catch(err => {
//         //     this.pipeErrorHandler.sourceErrorEmit(sourceOptions,
//         //         ErrorMessage.create(Status.ABORTED, JSON.stringify(err)));
//         // })
//     }
// }
