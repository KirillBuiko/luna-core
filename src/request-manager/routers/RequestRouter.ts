import type {RequestType_Strict} from "@grpc-build/RequestType";

import type {RequestName} from "@/types/general";

export interface RouterResult {
    endpointId?: string;
    buffer?: Buffer;
}

export abstract class RequestRouter {
    protected constructor() {

    }

    abstract getRouterResult(requestType: RequestType_Strict, requestName: RequestName, params?: Record<string, string>): Promise<RouterResult | null>;
}
