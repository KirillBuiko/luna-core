import type {EndpointName} from "@/app/types/EndpointConfigType";
import type {IEndpoint} from "@/app/types/IEndpoint";
import {GrpcEndpoint} from "@/endpoints/GrpcEndpoint";
import {RestApiEndpoint} from "@/endpoints/RestApiEndpoint";

export const endpoints: {[endpoint in EndpointName]: IEndpoint} = {
    computationModelsStorage: new RestApiEndpoint(),
    executor: new RestApiEndpoint(),
    generator: new RestApiEndpoint(),
    interpreter: new RestApiEndpoint(),
    modulesStorage: new RestApiEndpoint(),
    planner: new RestApiEndpoint(),
    programsStorage: new RestApiEndpoint(),
    tasksStorage: new RestApiEndpoint(),
    variablesStorage: new RestApiEndpoint()
}