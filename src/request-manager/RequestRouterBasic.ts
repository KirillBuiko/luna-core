import {RequestRouter} from "@/request-manager/RequestRouter";
import type {IRequestManager} from "@/app/types/IRequestManager";
import type {IEndpointsManager} from "@/app/types/IEndpointsManager";
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
