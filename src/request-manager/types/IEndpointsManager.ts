import type {EndpointConfigsType, EndpointGroup} from "@/app/types/RemoteStaticEndpointConfigType";
import type {IEndpoint} from "@/request-manager/types/IEndpoint";

export interface IEndpointsManager {
    initAll(configs: EndpointConfigsType): Promise<void>;
    getEndpoint(endpointId: string): IEndpoint | undefined;
    getAllEndpoints(): { [id: string]: IEndpoint };
    getEndpointsByGroup(endpointGroup: EndpointGroup): string[];
}
