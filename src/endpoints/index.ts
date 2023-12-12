import type {EndpointName} from "@/app/types/EndpointConfigType";
import type {IEndpoint} from "@/app/types/IEndpoint";
import {GrpcEndpoint} from "@/endpoints/GrpcEndpoint";
import {RestApiEndpoint} from "@/endpoints/RestApiEndpoint";

export const endpoints: {[endpoint in EndpointName]: IEndpoint} = {
    computationModelsStorage: new GrpcEndpoint(),
    executor: new GrpcEndpoint(),
    generator: new GrpcEndpoint(),
    interpreter: new GrpcEndpoint(),
    modulesStorage: new RestApiEndpoint(),
    planner: new GrpcEndpoint(),
    programsStorage: new GrpcEndpoint(),
    tasksStorage: new GrpcEndpoint(),
    variablesStorage: new GrpcEndpoint()
}