import type {RemoteStaticEndpointConfigType} from "@/app/types/RemoteStaticEndpointConfigType";

export interface IRemoteStaticEndpoint {
    init(config: RemoteStaticEndpointConfigType): Promise<Error | null>;
}
