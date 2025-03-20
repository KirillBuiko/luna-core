import type {RequestType_Strict} from "@grpc-build/RequestType";

import type {RequestName} from "@/types/general";
import type {IEndpointsManager} from "@/request-manager/types/IEndpointsManager";
import type {IRequestManager} from "@/request-manager/types/IRequestManager";
import type {IEventBus} from "@/event-bus/IEventBus";

export interface RouterResult {
    endpointId?: string;
    buffer?: Buffer;
}

export abstract class RequestRouter {
    protected constructor(protected deps: {requestManager: IRequestManager, endpointsManager: IEndpointsManager, eventBus: IEventBus}) {

    }

    abstract getRouterResult(requestType: RequestType_Strict, requestName: RequestName): Promise<RouterResult | null>;
}
