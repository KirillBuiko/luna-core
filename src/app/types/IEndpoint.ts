import type {
    NarrowedDestinationOptionsType,
} from "@/types/Types";
import type {GetRequestInfo} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";
import type {EndpointConfigType} from "@/app/types/EndpointConfigType";
import type {ProtocolType, RequestName} from "@/types/Enums";

export type EndpointStatus = "connected" | "not-connected";

export interface IEndpoint {
    status: EndpointStatus;

    init(config: EndpointConfigType): Promise<Error | null>;

    send<RequestT, ResponseT, RequestN extends RequestName>
    (requestName: RequestName, info: GetRequestInfo | DataRequestInfo):
        NarrowedDestinationOptionsType<ProtocolType.GRPC, RequestName>;
}


