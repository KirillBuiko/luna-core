"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRestApiRequestManager = void 0;
require("@/request-manager/RequestRouter");
require("@/pipe-builder/PipeBuilder");
const testObjects_1 = require("../testObjects");
const fs_1 = __importDefault(require("fs"));
const testConfigs_1 = require("../testConfigs");
class TestRestApiRequestManager {
    register(sourceOptions, info) {
        if (sourceOptions.requestName == "GET") {
            console.log("GET REQUEST2");
            const { writer } = sourceOptions;
            writer.write(JSON.stringify((0, testObjects_1.getDataInfo)(info.requestType)));
            fs_1.default.createReadStream(testConfigs_1.testConfigs.dataPath).pipe(writer);
        }
        else {
            console.log("SET REQUEST2");
            const { sourceReader: reader, writer: writer } = sourceOptions;
            reader
                .on("data", data => console.log(data.toString()))
                .on("end", () => writer(null, testObjects_1.getProgramInfo))
                .on("error", err => writer(err));
        }
    }
}
exports.TestRestApiRequestManager = TestRestApiRequestManager;
