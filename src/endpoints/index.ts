import type {IEndpoint} from "@/request-manager/types/IEndpoint";
import {RestApiEndpoint} from "@/endpoints/RestApiEndpoint";
import {CodeFStorageEndpoint} from "@/endpoints/specific-endpoints/handlers/CodeFragmentsStorageEndpoint";
import {RealVariableStorageEndpoint} from "@/endpoints/specific-endpoints/handlers/RealVariableStorageEndpoint";
import type {EndpointName} from "@/app/types/RemoteStaticEndpointConfigType";

export const endpointConstructors: {[endpoint in EndpointName]: new () => IEndpoint} = {
    realComputationModelsStorage: RestApiEndpoint,
    realExecutor: RestApiEndpoint,
    realGenerator: RestApiEndpoint,
    realInterpreter: RestApiEndpoint,
    realCodeFStorage: CodeFStorageEndpoint,
    realPlanner: RestApiEndpoint,
    realProgramsStorage: RestApiEndpoint,
    realTasksStorage: RestApiEndpoint,
    realVariablesStorage: RealVariableStorageEndpoint,
    executor1: RestApiEndpoint,
    executor2: RestApiEndpoint,
    executor3: RestApiEndpoint,
    variableStorage1: RealVariableStorageEndpoint,
    variableStorage2: RealVariableStorageEndpoint,
    variableStorage3: RealVariableStorageEndpoint
}
