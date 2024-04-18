import type {
    DestinationOptionsType, RequestName,
} from "@/types/Types";
import type {GetRequestInfo} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";
export type EndpointStatus = "connected" | "not-connected";

export interface IEndpoint {
    status: EndpointStatus;

    createSendHandler(requestName: RequestName, info: GetRequestInfo | DataRequestInfo):
        DestinationOptionsType;
}


