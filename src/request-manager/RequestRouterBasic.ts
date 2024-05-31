import {RequestRouter} from "@/request-manager/RequestRouter";
import type {IRequestManager} from "@/request-manager/types/IRequestManager";
import type {IEndpointsManager} from "@/request-manager/types/IEndpointsManager";
import type {EndpointName} from "@/app/types/RemoteStaticEndpointConfigType";

export class RequestRouterBasic extends RequestRouter {
    constructor(deps: {requestManager: IRequestManager, endpointsManager: IEndpointsManager},
                private endpointName: EndpointName) {
        super(deps);
    }

    async getEndpointName(): Promise<EndpointName | null> {
        return this.endpointName;
    }
}
