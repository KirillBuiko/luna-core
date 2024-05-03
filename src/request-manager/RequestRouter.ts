import type {RequestType__Output} from "@grpc-build/RequestType";
import type {EndpointName} from "@/app/types/RemoteStaticEndpointConfigType";

import type {RequestName} from "@/types/Types";
import type {IEndpointsManager} from "@/app/types/IEndpointsManager";
import type {IRequestManager} from "@/app/types/IRequestManager";

export abstract class RequestRouter {
    protected constructor(protected deps: {requestManager: IRequestManager, endpointsManager: IEndpointsManager}) {

    }

    abstract getEndpointName(requestType: RequestType__Output, requestName: RequestName): Promise<EndpointName | null>;
}
