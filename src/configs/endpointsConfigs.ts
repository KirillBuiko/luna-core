import type {EndpointConfigsType} from "@/app/types/EndpointConfigType";

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
        modulesStorage:
            {host: process.env.MODULES_STORAGE_HOST},
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
            {host: "localhost:5001"},
        executor:
            {host: "localhost:5002"},
        generator:
            {host: "localhost:5003"},
        interpreter:
            {host: "localhost:5004"},
        modulesStorage:
            {host: "localhost:5005"},
        planner:
            {host: "localhost:5006"},
        variablesStorage:
            {host: "localhost:5007"},
        programsStorage:
            {host: "localhost:5008"},
        tasksStorage:
            {host: "localhost:5009"}
    }