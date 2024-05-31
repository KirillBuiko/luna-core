import type {EndpointName} from "@/app/types/RemoteStaticEndpointConfigType";
import type {IEndpoint} from "@/request-manager/types/IEndpoint";
import {RestApiEndpoint} from "@/endpoints/RestApiEndpoint";
import {CodeFStorageEndpoint} from "@/endpoints/specific-endpoints/CodeFragmentsStorageEndpoint";
import {VariableStorageEndpoint} from "@/endpoints/specific-endpoints/VariableStorageEndpoint";

export const endpoints: {[endpoint in EndpointName]: IEndpoint} = {
    computationModelsStorage: new RestApiEndpoint(),
    executor: new RestApiEndpoint(),
    generator: new RestApiEndpoint(),
    interpreter: new RestApiEndpoint(),
    codeFStorage: new CodeFStorageEndpoint(),
    planner: new RestApiEndpoint(),
    programsStorage: new RestApiEndpoint(),
    tasksStorage: new RestApiEndpoint(),
    variablesStorage: new VariableStorageEndpoint()
}
