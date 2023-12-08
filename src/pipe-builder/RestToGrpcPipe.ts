import type {IPipeHandler} from "@/pipe-builder/IPipeHandler";
import type {NarrowedDestinationOptionsType} from "@/types/Types";
import type {NarrowedSourceOptionsType, RequestName} from "@/types/Types";
import {ErrorMessage} from "@/utils/ErrorMessage";
import {Status} from "@grpc/grpc-js/build/src/constants";
import type {DataStream__Output} from "@grpc-build/DataStream";


type SourceOptions = NarrowedSourceOptionsType<"REST_API", RequestName>;
type DestinationOptions = NarrowedDestinationOptionsType<"GRPC", RequestName>;

export class RestToGrpcPipe implements IPipeHandler {
    handle(sourceOptions: SourceOptions, destOptions: DestinationOptions) {
        const errorMessage = ErrorMessage.create(Status.UNAVAILABLE,
            "Error in routing or endpoint is not available")

        if (sourceOptions.requestName === "GET" && destOptions.requestName == "GET") {
            const {sourceWriter} = sourceOptions;
            const {destReader} = destOptions;
            if (sourceWriter && !destReader) {
                sourceWriter.code(500);
                sourceWriter.send(errorMessage);
            }
            if (!sourceWriter && destReader) {
                destReader.emit("error", errorMessage);
            }
            destReader.on("data", (data: DataStream__Output) => {
                if (data.infoOrData == "info") {
                    sourceWriter.raw.writeHead(200, { 'Content-Type': 'application/octet-stream' });
                    sourceWriter.raw.write(JSON.stringify(data.info));
                }
                if (data.infoOrData == "chunkData")
                    sourceWriter.raw.write(data.chunkData);
                // sourceWriter.send(data.chunkData);
            })

            destReader.on("close", () => {
                sourceWriter.raw.end();
            })

            destReader.on("error", err => {
                sourceWriter.code(500);
                sourceWriter.send(err);
            })
            // sourceWriter.send(destReader);
        } else if (sourceOptions.requestName === "SET" && destOptions.requestName == "SET") {
            const {sourceWriter, sourceReader} = sourceOptions;
            const {destWriter, destReader} = destOptions;
            if (sourceWriter && !destReader || sourceReader && !destWriter) {
                sourceWriter({
                    code: Status.UNAVAILABLE,
                    message: "Error in routing or endpoint is not available"
                });
                return;
            }
            if (!sourceWriter && destReader || !sourceReader && destWriter) {
                destWriter.emit("error", errorMessage);
                return;
            }
            sourceReader.on("data", data => {
                destWriter.write({
                    chunkData: data
                });
            });

            sourceReader.on("error", err => {
                destWriter.emit("error", err);
            });

            sourceReader.on("end", () => destWriter.end());

            destReader.then(data => {
                sourceWriter(null, data);
            }).catch(err => {
                sourceWriter(err);
            })
        }
    }
}