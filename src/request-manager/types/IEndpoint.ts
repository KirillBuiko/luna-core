import type {
    DestinationOptionsType, RequestName,
} from "@/types/general";
import type {GetInfo} from "@grpc-build/GetInfo";
import type {DataInfo} from "@grpc-build/DataInfo";
import type {RemoteStaticEndpointConfigType} from "@/app/types/RemoteStaticEndpointConfigType";
export type EndpointStatus = "connected" | "not-connected";

export interface IEndpoint {
    status: EndpointStatus;
    config: RemoteStaticEndpointConfigType;

    init(config: RemoteStaticEndpointConfigType): Promise<Error | null>;

    createSendHandler(requestName: RequestName, info: GetInfo | DataInfo):
        DestinationOptionsType;
}


