import type {EndpointConfigsType} from "@/app/types/EndpointConfigType";

export const endpointConfigs: EndpointConfigsType = {
    computationModelsStorage:
        {host: "localhost:5060"},
    executor:
        {host: "localhost:5061"},
    generator:
        {host: "localhost:5062"},
    interpreter:
        {host: "localhost:5063"},
    modulesStorage:
        {host: "localhost:5064"},
    planner:
        {host: "localhost:5065"},
    variablesStorage:
        {host: "localhost:5066"},
    programsStorage:
        {host: "localhost:5067"},
    tasksStorage:
        {host: "localhost:5068"}
}