"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestRouter = void 0;
const routes = {
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
    MODULE: {
        GET: "modulesStorage",
        SET: "modulesStorage"
    },
    MODULE_LIST: {
        GET: "modulesStorage",
        SET: null
    },
    MODULE_INFO: {
        GET: "modulesStorage",
        SET: "modulesStorage"
    }
};
class RequestRouter {
    getEndpointName(requestType, requestName) {
        // if (!requestType || !requestName || !routes[requestType] || !) return null;
        // console.log(requestType, requestName);
        return requestType && requestName && routes[requestType] && routes[requestType][requestName] || null;
    }
}
exports.RequestRouter = RequestRouter;
