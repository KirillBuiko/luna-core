import type {EndpointStatus, IEndpoint} from "@/app/types/IEndpoint";
import type {GetInfo__Output} from "@grpc-build/GetInfo";
import type {DataInfo} from "@grpc-build/DataInfo";
import type {DestinationOptionsType, ProtocolType, RequestName} from "@/types/Types";
import type {RemoteStaticEndpointConfigType} from "@/app/types/RemoteStaticEndpointConfigType";

export abstract class Endpoint implements IEndpoint {
    status: EndpointStatus = "not-connected";
    abstract protocol: ProtocolType;

    abstract init(config: RemoteStaticEndpointConfigType): Promise<Error | null>;

    createSendHandler<RN extends RequestName>(requestName: RN,
                                              info: RN extends "GET" ? GetInfo__Output : DataInfo):
        DestinationOptionsType {
        // if (this.status !== "connected") return {protocol: this.protocol, requestName} as DestinationOptionsType;
        switch (requestName) {
            case "GET":
                return this.getGetHandler(info as GetInfo__Output);
            case "SET":
                return this.getSetHandler(info as DataInfo);
        }
        return {protocol: this.protocol} as DestinationOptionsType;
    }

    protected abstract getGetHandler(info: GetInfo__Output);

    protected abstract getSetHandler(info: DataInfo);
}
