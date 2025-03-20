import type {EndpointConfigsType} from "@/app/types/RemoteStaticEndpointConfigType";
import {scenarioEndpointConfigs} from "./scenarioEndpointConfigs";
import {randomUUID} from "node:crypto";

export const endpointConfigs: EndpointConfigsType = process.env.SCENARIO_NAME
    ? scenarioEndpointConfigs
    : process.env.NODE_ENV == "production"
        ? [
            {host: process.env.COMPUTATION_MODELS_STORAGE_HOST || "", group: "computationModelsStorage", name: "realComputationModelsStorage", id: randomUUID()},
            {host: process.env.EXECUTOR_HOST || "", group: "executor", name: "realExecutor", id: randomUUID()},
            {host: process.env.GENERATOR_HOST || "", group: "generator", name: "realGenerator", id: randomUUID()},
            {host: process.env.INTERPRETER_HOST || "", group: "interpreter", name: "realInterpreter", id: randomUUID()},
            {host: process.env.CODE_F_STORAGE_HOST || "", group: "codeFStorage", name: "realCodeFStorage", id: randomUUID()},
            {host: process.env.PLANNER_HOST || "", group: "planner", name: "realPlanner", id: randomUUID()},
            {host: process.env.VARIABLES_STORAGE_HOST || "", group: "variablesStorage", name: "realVariablesStorage", id: randomUUID()},
            {host: process.env.PROGRAMS_STORAGE_HOST || "", group: "programsStorage", name: "realProgramsStorage", id: randomUUID()},
            {host: process.env.TASKS_STORAGE_HOST || "", group: "tasksStorage", name: "realTasksStorage", id: randomUUID()}
        ]
        : [
            {host: "http://192.168.12.29:5001", group: "computationModelsStorage", name: "realComputationModelsStorage", id: randomUUID()},
            {host: "http://192.168.12.29:9876", group: "executor", name: "realExecutor", id: randomUUID()},
            {host: "http://192.168.12.29:5555", group: "generator", name: "realGenerator", id: randomUUID()},
            {host: "http://192.168.12.29:5004", group: "interpreter", name: "realInterpreter", id: randomUUID()},
            {host: "http://192.168.12.29:12345", group: "codeFStorage", name: "realCodeFStorage", id: randomUUID()},
            {host: "http://192.168.12.29:5006", group: "planner", name: "realPlanner", id: randomUUID()},
            {host: "http://192.168.12.29:9100", group: "variablesStorage", name: "realVariablesStorage", id: randomUUID()},
            {host: "http://192.168.12.29:5008", group: "programsStorage", name: "realProgramsStorage", id: randomUUID()},
            {host: "http://192.168.12.29:5009", group: "tasksStorage", name: "realTasksStorage", id: randomUUID()}
        ]
