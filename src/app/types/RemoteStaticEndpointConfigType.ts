export interface RemoteStaticEndpointConfigType {
    id: string;
    name: EndpointName;
    host: string;
    group: EndpointGroup;
}

export type EndpointName =
    | "realComputationModelsStorage"
    | "realExecutor"
    | "realGenerator"
    | "realInterpreter"
    | "realCodeFStorage"
    | "realPlanner"
    | "realVariablesStorage"
    | "realProgramsStorage"
    | "realTasksStorage"
    | "variableStorage1"
    | "variableStorage2"
    | "variableStorage3"
    | "executor1"
    | "executor2"
    | "executor3"


export type EndpointGroup =
    | "generator"
    | "executor"
    | "interpreter"
    | "planner"
    | "variablesStorage"
    | "codeFStorage"
    | "computationModelsStorage"
    | "tasksStorage"
    | "programsStorage"

export type EndpointConfigsType = RemoteStaticEndpointConfigType[];
