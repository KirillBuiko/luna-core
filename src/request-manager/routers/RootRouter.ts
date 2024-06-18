"use strict"
import type {RequestType__Output} from "@grpc-build/RequestType";
import type {EndpointName} from "@/app/types/RemoteStaticEndpointConfigType";

import type {RequestName} from "@/types/Types";
import {RequestRouter} from "@/request-manager/routers/RequestRouter";
import type {IRequestManager} from "@/request-manager/types/IRequestManager";
import type {IEndpointsManager} from "@/request-manager/types/IEndpointsManager";

export class RootRouter extends RequestRouter {
    routes: {[requestType in RequestType__Output]?: {[requestName in RequestName]: EndpointName | RequestRouter | null}};

    constructor(deps: {requestManager: IRequestManager, endpointsManager: IEndpointsManager}) {
        super(deps);
        this.initRoutes();
    }

    async getEndpointName(requestType: RequestType__Output, requestName: RequestName): Promise<EndpointName | null> {
        const route: null | EndpointName | RequestRouter =
            (this.routes && this.routes[requestType] && this.routes[requestType]![requestName]) || null;
        if (typeof route == "string") return route;
        if (route) return route.getEndpointName(requestType, requestName);
        return null;
    }

    initRoutes() {
        this.routes = {
            UNKNOWN_REQUEST_TYPE: {
                GET: null,
                SET: null
            },

            // CODE FRAGMENTS STORAGE

            CODE_F: {
                GET: "codeFStorage",
                SET: "codeFStorage"
            },
            CODE_F_LIST: {
                GET: "codeFStorage",
                SET: null
            },
            CODE_F_INFO: {
                GET: "codeFStorage",
                SET: null
            },
            CODE_F_PLUGIN: {
                GET: "codeFStorage",
                SET: "codeFStorage"
            },
            CODE_F_PLUGINS_LIST: {
                GET: "codeFStorage",
                SET: null
            },
            CODE_F_PLUGIN_PROCEDURE: {
                GET: "codeFStorage",
                SET: null
            },

            // VARIABLE STORAGE

            VAR_VALUE: {
                GET: "variablesStorage",
                SET: "variablesStorage"
            },
            VAR_VALUE_DELETE: {
                GET: null,
                SET: "variablesStorage"
            },
            VAR_VALUE_LIST: {
                GET: "variablesStorage",
                SET: null
            },
            VAR_VALUE_META: {
                GET: "variablesStorage",
                SET: "variablesStorage"
            },
            VAR_VALUE_META_DELETE: {
                GET: null,
                SET: "variablesStorage"
            }
        }
    }
}
