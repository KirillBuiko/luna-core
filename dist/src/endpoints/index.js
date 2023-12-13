"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endpoints = void 0;
const GrpcEndpoint_1 = require("@/endpoints/GrpcEndpoint");
const RestApiEndpoint_1 = require("@/endpoints/RestApiEndpoint");
exports.endpoints = {
    computationModelsStorage: new GrpcEndpoint_1.GrpcEndpoint(),
    executor: new GrpcEndpoint_1.GrpcEndpoint(),
    generator: new GrpcEndpoint_1.GrpcEndpoint(),
    interpreter: new GrpcEndpoint_1.GrpcEndpoint(),
    modulesStorage: new RestApiEndpoint_1.RestApiEndpoint(),
    planner: new GrpcEndpoint_1.GrpcEndpoint(),
    programsStorage: new GrpcEndpoint_1.GrpcEndpoint(),
    tasksStorage: new GrpcEndpoint_1.GrpcEndpoint(),
    variablesStorage: new GrpcEndpoint_1.GrpcEndpoint()
};
