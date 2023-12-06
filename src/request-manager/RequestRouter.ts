import type {RequestType__Output} from "@grpc-build/RequestType";
import type {EndpointName} from "@/app/types/EndpointConfigType";
import {RequestName} from "@/types/Enums";

const routes: {[requestType in RequestType__Output]: {[requestName in RequestName]: EndpointName | null}} = {
    "UNKNOWN_REQUEST_TYPE": {
        [RequestName.GET]: null,
        [RequestName.SET]: null
    },
    "VARIABLE": {
        [RequestName.GET]: "variablesStorage",
        [RequestName.SET]: "variablesStorage"
    },
    "VARIABLE_LIST": {
        [RequestName.GET]: "variablesStorage",
        [RequestName.SET]: null
    },
    "PROGRAM": {
        [RequestName.GET]: "programsStorage",
        [RequestName.SET]: "programsStorage"
    },
    "PROGRAM_EXECUTE": {
        [RequestName.GET]: "executor",
        [RequestName.SET]: null
    },
    "PROGRAM_GENERATE": {
        [RequestName.GET]: "generator",
        [RequestName.SET]: null
    },
    "PROGRAM_INTERPRET": {
        [RequestName.GET]: "interpreter",
        [RequestName.SET]: null
    },
    "COMPUTATIONAL_MODEL": {
        [RequestName.GET]: "computationModelsStorage",
        [RequestName.SET]: "computationModelsStorage"
    },
    "COMPUTATIONAL_MODEL_LIST": {
        [RequestName.GET]: "computationModelsStorage",
        [RequestName.SET]: null
    },
    "TASK": {
        [RequestName.GET]: "tasksStorage",
        [RequestName.SET]: "tasksStorage"
    },
    "TASK_LIST": {
        [RequestName.GET]: "tasksStorage",
        [RequestName.SET]: null
    },
    "TASK_PLAN": {
        [RequestName.GET]: "planner",
        [RequestName.SET]: null
    },
}

export class RequestRouter {
    getEndpointName(requestType: RequestType__Output, requestName: RequestName): EndpointName | null {
        console.log(requestType, requestName);
        console.log(routes[requestType][requestName]);
        return routes[requestType][requestName];
    }
}