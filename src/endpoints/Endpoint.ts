import type {EndpointStatus, IEndpoint} from "@/app/types/IEndpoint";
import type {EndpointConfigType} from "@/app/types/EndpointConfigType";
import type {GetRequestInfo} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";
import type {DestinationOptionsType, ProtocolType, RequestName} from "@/types/Types";

export abstract class Endpoint implements IEndpoint {
    status: EndpointStatus = "not-connected";
    abstract protocol: ProtocolType;

    abstract init(config: EndpointConfigType): Promise<Error | null>;

    send(requestName: RequestName, info: GetRequestInfo | DataRequestInfo):
        DestinationOptionsType {
        // if (this.status !== "connected") return {protocol: this.protocol, requestName} as DestinationOptionsType;
        switch (requestName) {
            case "GET":
                return this.getHandler(info as GetRequestInfo);
            case "SET":
                return this.setHandler(info as DataRequestInfo);
        }
        return {protocol: this.protocol} as DestinationOptionsType;
    }

    protected abstract getHandler(info: GetRequestInfo);
    protected abstract setHandler(info: DataRequestInfo);
}