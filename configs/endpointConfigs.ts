import type {EndpointConfigsType} from "@/app/types/RemoteStaticEndpointConfigType";

export const endpointConfigs: EndpointConfigsType =
    process.env.NODE_ENV == "production"
    ? {
        computationModelsStorage:
            {host: process.env.COMPUTATION_MODELS_STORAGE_HOST || ""},
        executor:
            {host: process.env.EXECUTOR_HOST || ""},
        generator:
            {host: process.env.GENERATOR_HOST || ""},
        interpreter:
            {host: process.env.INTERPRETER_HOST || ""},
        codeFStorage:
            {host: process.env.CODE_F_STORAGE_HOST || ""},
        planner:
            {host: process.env.PLANNER_HOST || ""},
        variablesStorage:
            {host: process.env.VARIABLES_STORAGE_HOST || ""},
        programsStorage:
            {host: process.env.PROGRAMS_STORAGE_HOST || ""},
        tasksStorage:
            {host: process.env.TASKS_STORAGE_HOST || ""}
    }
    : {
        computationModelsStorage:
            {host: "http://192.168.12.29:5001"},
        executor:
            {host: "http://192.168.12.29:9876"},
        generator:
            {host: "http://192.168.12.29:5555"},
        interpreter:
            {host: "http://192.168.12.29:5004"},
        codeFStorage:
            {host: "http://192.168.12.29:12345"},
        planner:
            {host: "http://192.168.12.29:5006"},
        variablesStorage:
            {host: "http://192.168.12.29:8111"},
        programsStorage:
            {host: "http://192.168.12.29:5008"},
        tasksStorage:
            {host: "http://192.168.12.29:5009"}
    }
