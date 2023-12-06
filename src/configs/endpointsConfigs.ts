import type {EndpointConfigsType} from "@/app/types/EndpointConfigType";

export const endpointConfigs: EndpointConfigsType = {
    computationModelsStorage:
        {host: "localhost:5001"},
    executor:
        {host: "localhost:5002"},
    generator:
        {host: "localhost:5003"}, // grpc
    interpreter:
        {host: "localhost:5004"},
    modulesStorage:
        {host: "localhost:5005"},
    planner:
        {host: "localhost:5006"},
    variablesStorage:
        {host: "localhost:5007"}, // rest
    programsStorage:
        {host: "localhost:5008"},
    tasksStorage:
        {host: "localhost:5009"}
}