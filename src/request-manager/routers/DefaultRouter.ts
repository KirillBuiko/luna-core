"use strict"
import type {RequestType_Strict} from "@grpc-build/RequestType";

import type {RequestName} from "@/types/general";
import {RequestRouter, type RouterResult} from "@/request-manager/routers/RequestRouter";
import type {IEndpointsManager} from "@/request-manager/types/IEndpointsManager";
import type {IEventBus} from "@/event-bus/IEventBus";

export class DefaultRouter extends RequestRouter {
    routes: {[requestType in RequestType_Strict]?: {[requestName in RequestName]: string | RequestRouter | null}};

    constructor(protected deps: {endpointsManager: IEndpointsManager, eventBus: IEventBus}) {
        super();
        setTimeout(() => {
            this.initRoutes();
        })
    }

    async getRouterResult(requestType: RequestType_Strict, requestName: RequestName, params: Record<string, string>): Promise<RouterResult | null> {
        const route: null | string | RequestRouter =
            (this.routes && this.routes[requestType] && this.routes[requestType]![requestName]) || null;
        if (typeof route == "string") return {
            endpointId: route
        };
        if (route) return route.getRouterResult(requestType, requestName);
        return null;
    }

    initRoutes() {

        const codeFId = this.deps.endpointsManager.getEndpointsByGroup("codeFStorage")[0];
        const varstId = this.deps.endpointsManager.getEndpointsByGroup("variablesStorage")[0];

        this.routes = {
            UNKNOWN_REQUEST_TYPE: {
                GET: null,
                SET: null
            },

            // CODE FRAGMENTS STORAGE

            CODE_F: {
                GET: codeFId,
                SET: codeFId
            },
            CODE_F_LIST: {
                GET: codeFId,
                SET: null
            },
            CODE_F_INFO: {
                GET: codeFId,
                SET: null
            },
            CODE_F_PLUGIN: {
                GET: codeFId,
                SET: codeFId
            },
            CODE_F_PLUGINS_LIST: {
                GET: codeFId,
                SET: null
            },
            CODE_F_PLUGIN_PROCEDURE: {
                GET: codeFId,
                SET: null
            },

            // VARIABLE STORAGE

            VAR_VALUE: {
                GET: varstId,
                SET: varstId
            },
            VAR_VALUE_DELETE: {
                GET: null,
                SET: varstId
            },
            VAR_VALUE_LIST: {
                GET: varstId,
                SET: null
            },
            VAR_VALUE_META: {
                GET: varstId,
                SET: varstId
            },
            VAR_VALUE_META_DELETE: {
                GET: null,
                SET: varstId
            }
        }
    }
}
