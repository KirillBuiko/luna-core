export interface RemoteStaticEndpointConfigType {
    host: string
}

export type EndpointName =
    | "generator"
    | "executor"
    | "interpreter"
    | "planner"
    | "variablesStorage"
    | "cfStorage"
    | "computationModelsStorage"
    | "tasksStorage"
    | "programsStorage"

export type EndpointConfigsType = {[endpoint in EndpointName]: RemoteStaticEndpointConfigType}
