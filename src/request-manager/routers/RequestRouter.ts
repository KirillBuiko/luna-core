import type {RequestType__Output} from "@grpc-build/RequestType";
import type {EndpointName} from "@/app/types/RemoteStaticEndpointConfigType";

import type {RequestName} from "@/types/general";
import type {IEndpointsManager} from "@/request-manager/types/IEndpointsManager";
import type {IRequestManager} from "@/request-manager/types/IRequestManager";

export abstract class RequestRouter {
    protected constructor(protected deps: {requestManager: IRequestManager, endpointsManager: IEndpointsManager}) {

    }

    abstract getEndpointName(requestType: RequestType__Output, requestName: RequestName): Promise<EndpointName | null>;
}
