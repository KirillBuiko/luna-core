import type {RequestType__Output} from "@grpc-build/RequestType";
import type {EndpointName} from "@/app/types/EndpointConfigType";

import type {RequestName} from "@/types/Types";

const routes: {[requestType in RequestType__Output]: {[requestName in RequestName]: EndpointName | null}} = {
    UNKNOWN_REQUEST_TYPE: {
        GET: null,
        SET: null
    },
    VARIABLE: {
        GET: "variablesStorage",
        SET: "variablesStorage"
    },
    VARIABLE_LIST: {
        GET: "variablesStorage",
        SET: null
    },
    PROGRAM: {
        GET: "programsStorage",
        SET: "programsStorage"
    },
    PROGRAM_EXECUTE: {
        GET: "executor",
        SET: null
    },
    PROGRAM_GENERATE: {
        GET: "generator",
        SET: null
    },
    PROGRAM_INTERPRET: {
        GET: "interpreter",
        SET: null
    },
    COMPUTATIONAL_MODEL: {
        GET: "computationModelsStorage",
        SET: "computationModelsStorage"
    },
    COMPUTATIONAL_MODEL_LIST: {
        GET: "computationModelsStorage",
        SET: null
    },
    TASK: {
        GET: "tasksStorage",
        SET: "tasksStorage"
    },
    TASK_LIST: {
        GET: "tasksStorage",
        SET: null
    },
    TASK_PLAN: {
        GET: "planner",
        SET: null
    },
}

export class RequestRouter {
    getEndpointName(requestType: RequestType__Output, requestName: RequestName): EndpointName | null {
        // if (!requestType || !requestName || !routes[requestType] || !) return null;
        console.log(requestType, requestName);
        return requestType && requestName && routes[requestType] && routes[requestType][requestName] || null;
    }
}