"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestGrpcRequestManager = void 0;
const fs_1 = __importDefault(require("fs"));
const testConfigs_1 = require("../testConfigs");
const testObjects_1 = require("../testObjects");
class TestGrpcRequestManager {
    register(sourceOptions, info) {
        if (sourceOptions.requestName == "GET") {
            console.log("GET REQUEST");
            const { writer } = sourceOptions;
            writer.write({
                info: testObjects_1.testObjects.set
            });
            const fileStream = fs_1.default.createReadStream(testConfigs_1.testConfigs.dataPath);
            fileStream
                .on("data", data => writer.write({ chunkData: data }))
                .on("end", () => writer.end())
                .on("error", err => writer.destroy(err));
        }
        else {
            console.log("SET REQUEST");
            const { sourceReader: reader, writer: writer } = sourceOptions;
            reader
                .on("data", data => console.log(data.infoOrData == "info" ? data.info : data.chunkData.toString()))
                .on("end", () => writer(null, testObjects_1.testObjects.get))
                .on("error", err => writer(err));
        }
    }
}
exports.TestGrpcRequestManager = TestGrpcRequestManager;
