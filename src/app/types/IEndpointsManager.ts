import type {EndpointConfigsType, EndpointName} from "@/app/types/RemoteStaticEndpointConfigType";
import type {IEndpoint} from "@/app/types/IEndpoint";

export interface IEndpointsManager {
    initAll(configs: EndpointConfigsType): Promise<void>;
    getEndpoint(endpointName: EndpointName): IEndpoint;
}
