import type {EndpointName} from "@/app/types/RemoteStaticEndpointConfigType";
import type {IEndpoint} from "@/app/types/IEndpoint";
import {RestApiEndpoint} from "@/endpoints/RestApiEndpoint";
import {codeFStorageEndpoint} from "@/endpoints/specific-endpoints/CodeFragmentsStorageEndpoint";

export const endpoints: {[endpoint in EndpointName]: IEndpoint} = {
    computationModelsStorage: new RestApiEndpoint(),
    executor: new RestApiEndpoint(),
    generator: new RestApiEndpoint(),
    interpreter: new RestApiEndpoint(),
    codeFStorage: new codeFStorageEndpoint(),
    planner: new RestApiEndpoint(),
    programsStorage: new RestApiEndpoint(),
    tasksStorage: new RestApiEndpoint(),
    variablesStorage: new RestApiEndpoint()
}
