import type {
    DestinationOptionsType, RequestName,
} from "@/types/Types";
import type {GetRequestInfo} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";
import type {RemoteStaticEndpointConfigType} from "@/app/types/RemoteStaticEndpointConfigType";
export type EndpointStatus = "connected" | "not-connected";

export interface IEndpoint {
    status: EndpointStatus;

    init(config: RemoteStaticEndpointConfigType): Promise<Error | null>;

    createSendHandler(requestName: RequestName, info: GetRequestInfo | DataRequestInfo):
        DestinationOptionsType;
}


