import {Endpoint} from "@/endpoints/Endpoint";
import type {IRemoteStaticEndpoint} from "@/app/types/IRemoteStaticEndpoint";
import type {RemoteStaticEndpointConfigType} from "@/app/types/RemoteStaticEndpointConfigType";

export abstract class RemoteStaticEndpoint extends Endpoint implements IRemoteStaticEndpoint {
    abstract init(config: RemoteStaticEndpointConfigType): Promise<Error | null>;
}
