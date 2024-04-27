import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";
import type {GetRequestInfo} from "@grpc-build/GetRequestInfo";
import {RestApiEndpoint} from "@/endpoints/RestApiEndpoint";
import type {MultipartTransferObject, NarrowedDestinationOptionsType} from "@/types/Types";

export class CodeFragmentsStorageEndpoint extends RestApiEndpoint {
    protected someGetHandler(info: GetRequestInfo):
        NarrowedDestinationOptionsType<"REST_API", "GET"> {
        const multipart = this.getMultipart({
            url: `${this.config.host}/get?info=${JSON.stringify(info)}`
        })

        const reader = (async (): Promise<MultipartTransferObject> => {
            const resolvedMultipart = await multipart;
            if (!("info" in resolvedMultipart.fields)) {
                throw "No info in multipart";
            }
            return {
                info: JSON.parse(resolvedMultipart.fields.info),
                data: resolvedMultipart.stream
            }
        })()

        return {
            requestName: "GET",
            protocol: "REST_API",
            destReader: reader
        }
    }

    protected someSetHandler(info: DataRequestInfo):
        NarrowedDestinationOptionsType<"REST_API", "SET"> {
        const {reader, dataWriter} = this.sendMultipart({
            url: `${this.config.host}/set`,
            streamName: "data",
            fields: {
                info: JSON.stringify(info)
            }
        })

        const transformedReader = (async () => {
            const resolved = await reader;
            return JSON.parse(resolved);
        })()

        return {
            requestName: "SET",
            protocol: "REST_API",
            destReader: transformedReader,
            destWriter: dataWriter
        }
    }
}
