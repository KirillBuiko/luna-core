"use strict"
import type {RequestType__Output} from "@grpc-build/RequestType";
import type {EndpointName} from "@/app/types/RemoteStaticEndpointConfigType";

import type {RequestName} from "@/types/Types";
import {RequestRouter} from "@/request-manager/RequestRouter";
import type {IRequestManager} from "@/app/types/IRequestManager";
import type {IEndpointsManager} from "@/app/types/IEndpointsManager";

export class RootRouter extends RequestRouter {
    routes: {[requestType in RequestType__Output]?: {[requestName in RequestName]: EndpointName | RequestRouter | null}};

    constructor(deps: {requestManager: IRequestManager, endpointsManager: IEndpointsManager}) {
        super(deps);
        this.initRoutes();
    }

    async getEndpointName(requestType: RequestType__Output, requestName: RequestName): Promise<EndpointName | null> {
        const route: null | EndpointName | RequestRouter =
            (this.routes && this.routes[requestType] && this.routes[requestType]![requestName]) || null;
        if ("string" == typeof route) return route;
        if (route) return route.getEndpointName(requestType, requestName);
        return null;
    }

    initRoutes() {
        this.routes = {
            UNKNOWN_REQUEST_TYPE: {
                GET: null,
                SET: null
            },
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
            // VARIABLE: {
            //     GET: "variablesStorage",
            //     SET: "variablesStorage"
            // },
            // VARIABLE_LIST: {
            //     GET: "variablesStorage",
            //     SET: null
            // },
            // PROGRAM: {
            //     GET: "programsStorage",
            //     SET: "programsStorage"
            // },
            // PROGRAM_EXECUTE: {
            //     GET: "executor",
            //     SET: null
            // },
            // PROGRAM_GENERATE: {
            //     GET: "generator",
            //     SET: null
            // },
            // PROGRAM_INTERPRET: {
            //     GET: "interpreter",
            //     SET: null
            // },
            // COMPUTATIONAL_MODEL: {
            //     GET: "computationModelsStorage",
            //     SET: "computationModelsStorage"
            // },
            // COMPUTATIONAL_MODEL_LIST: {
            //     GET: "computationModelsStorage",
            //     SET: null
            // },
            // TASK: {
            //     GET: "tasksStorage",
            //     SET: "tasksStorage"
            // },
            // TASK_LIST: {
            //     GET: "tasksStorage",
            //     SET: null
            // },
            // TASK_PLAN: {
            //     GET: "planner",
            //     SET: null
            // },
        }
    }
}
