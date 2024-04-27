import type {EndpointConfigsType} from "@/app/types/RemoteStaticEndpointConfigType";

export const endpointConfigs: EndpointConfigsType =
    process.env.NODE_ENV == "production"
    ? {
        computationModelsStorage:
            {host: process.env.COMPUTATION_MODELS_STORAGE_HOST},
        executor:
            {host: process.env.EXECUTOR_HOST},
        generator:
            {host: process.env.GENERATOR_HOST},
        interpreter:
            {host: process.env.INTERPRETER_HOST},
        codeFragmentsStorage:
            {host: process.env.CODE_FRAGMENT_STORAGE_HOST},
        planner:
            {host: process.env.PLANNER_HOST},
        variablesStorage:
            {host: process.env.VARIABLES_STORAGE_HOST},
        programsStorage:
            {host: process.env.PROGRAMS_STORAGE_HOST},
        tasksStorage:
            {host: process.env.TASKS_STORAGE_HOST}
    }
    : {
        computationModelsStorage:
            {host: "http://localhost:5001"},
        executor:
            {host: "http://localhost:5002"},
        generator:
            {host: "http://localhost:5003"},
        interpreter:
            {host: "http://localhost:5004"},
        codeFragmentsStorage:
            {host: "http://localhost:5005"},
        planner:
            {host: "http://localhost:5006"},
        variablesStorage:
            {host: "http://localhost:5007"},
        programsStorage:
            {host: "http://localhost:5008"},
        tasksStorage:
            {host: "http://localhost:5009"}
    }
