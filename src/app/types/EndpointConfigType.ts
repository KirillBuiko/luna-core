export interface EndpointConfigType {
    host: string
}

export type EndpointName =
    | "generator"
    | "executor"
    | "interpreter"
    | "planner"
    | "variablesStorage"
    | "modulesStorage"
    | "computationModelsStorage"
    | "tasksStorage"
    | "programsStorage"

export type EndpointConfigsType = {[endpoint in EndpointName]: EndpointConfigType}
