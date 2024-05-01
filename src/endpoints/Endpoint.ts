import type {EndpointStatus, IEndpoint} from "@/app/types/IEndpoint";
import type {GetRequestInfo__Output} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";
import type {DestinationOptionsType, ProtocolType, RequestName} from "@/types/Types";
import type {RemoteStaticEndpointConfigType} from "@/app/types/RemoteStaticEndpointConfigType";

export abstract class Endpoint implements IEndpoint {
    status: EndpointStatus = "not-connected";
    abstract protocol: ProtocolType;

    abstract init(config: RemoteStaticEndpointConfigType): Promise<Error | null>;

    createSendHandler<RN extends RequestName>(requestName: RN,
                                              info: RN extends "GET" ? GetRequestInfo__Output : DataRequestInfo):
        DestinationOptionsType {
        // if (this.status !== "connected") return {protocol: this.protocol, requestName} as DestinationOptionsType;
        switch (requestName) {
            case "GET":
                return this.getGetHandler(info as GetRequestInfo__Output);
            case "SET":
                return this.getSetHandler(info as DataRequestInfo);
        }
        return {protocol: this.protocol} as DestinationOptionsType;
    }

    protected abstract getGetHandler(info: GetRequestInfo__Output);

    protected abstract getSetHandler(info: DataRequestInfo);
}
