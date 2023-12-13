"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRestApiClient = void 0;
const fs = __importStar(require("fs"));
const testConfigs_1 = require("../testConfigs");
const RestApiEndpoint_1 = require("@/endpoints/RestApiEndpoint");
const logging_1 = require("@grpc/grpc-js/build/src/logging");
class TestRestApiClient extends RestApiEndpoint_1.RestApiEndpoint {
    constructor() {
        super();
    }
    async get(info) {
        const options = super.getHandler(info);
        options.destReader.on("data", data => {
            console.log(data.toString());
        });
    }
    async set(info) {
        const options = super.setHandler(info);
        options.destWriter && fs.createReadStream(testConfigs_1.testConfigs.dataPath).pipe(options.destWriter);
        options.destReader?.then(data => {
            console.log(data.toString());
        }).catch(err => (0, logging_1.log)(err));
    }
}
exports.TestRestApiClient = TestRestApiClient;
