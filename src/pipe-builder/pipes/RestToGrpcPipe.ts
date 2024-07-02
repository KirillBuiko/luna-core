// import type {NarrowedDestination} from "@/types/Types";
// import type {NarrowedSource, RequestName} from "@/types/Types";
// import {ErrorMessage} from "@/utils/ErrorMessage";
// import {Status} from "@grpc/grpc-js/build/src/constants";
// import type {DataStream_Strict} from "@grpc-build/DataStream";
// import {AbstractPipe} from "@/pipe-builder/pipes/AbstractPipe";
//
// type S = "REST_API";
// type D = "GRPC";
//
// export class RestToGrpcPipe extends AbstractPipe<S, D> {
//     protected pipeGet(sourceOptions: NarrowedSource<S, "GET">,
//                       destOptions: NarrowedDestination<D, "GET">) {
//         const {sourceWriter} = sourceOptions;
//         const {destReader} = destOptions;
//
//         // TODO: support it
//         // destReader
//         //     .on("data", (data: DataStream_Strict) =>
//         //         data.infoOrData == "info"
//         //             ? sourceWriter.write(JSON.stringify(data.info))
//         //             : sourceWriter.write(data.chunkData))
//         //     .on("end", () =>
//         //         sourceWriter.end())
//         //     .on("error", err => {
//         //         this.pipeErrorHandler.sourceErrorEmit(sourceOptions,
//         //             ErrorMessage.create(Status.ABORTED, JSON.stringify(err)));
//         //     });
//     }
//
//     protected pipeSet(sourceOptions: NarrowedSource<S, "SET">,
//                       destOptions: NarrowedDestination<D, "SET">) {
//         const {sourceWriter, sourceReader} = sourceOptions;
//         const {destWriter, destReader} = destOptions;
//
//         // TODO: support it
//         // sourceReader
//         //     .on("data", data => destWriter.write({chunkData: data}))
//         //     .on("end", () => destWriter.end())
//         //     .on("error", err => {
//         //         this.pipeErrorHandler.destinationErrorEmit(destOptions,
//         //             ErrorMessage.create(Status.ABORTED, JSON.stringify(err)));
//         //     });
//         //
//         // destReader.then(data => {
//         //     sourceWriter(null, data);
//         // }).catch(err => {
//         //     this.pipeErrorHandler.sourceErrorEmit(sourceOptions,
//         //         ErrorMessage.create(Status.ABORTED, JSON.stringify(err)));
//         // })
//     }
// }
