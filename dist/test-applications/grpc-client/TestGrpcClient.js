"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestGrpcClient = void 0;
require("@grpc/proto-loader");
require("@/grpcLoadOptions");
require("@grpc/grpc-js");
require("@grpc/grpc-js");
require("@/configs/configs");
const fs_1 = __importDefault(require("fs"));
const testConfigs_1 = require("../testConfigs");
const GrpcEndpoint_1 = require("@/endpoints/GrpcEndpoint");
class TestGrpcClient extends GrpcEndpoint_1.GrpcEndpoint {
    constructor() {
        super();
    }
    get(info) {
        const { destReader: reader } = this.getHandler(info);
        reader
            .on("data", (data) => console.log(data.infoOrData == "info" ? JSON.stringify(data.info) : data.chunkData.toString()))
            .on("error", (err) => {
            console.log(err);
        });
    }
    async set(info) {
        const { destReader: reader, destWriter: writer } = this.setHandler(info);
        fs_1.default.createReadStream(testConfigs_1.testConfigs.dataPath)
            .on("data", data => writer.write({ chunkData: data }))
            .on("error", (err) => writer.destroy(err))
            .on("end", () => writer.end());
        reader.then((data) => {
            console.log(data);
        });
    }
}
exports.TestGrpcClient = TestGrpcClient;
