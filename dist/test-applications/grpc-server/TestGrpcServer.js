"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestGrpcServer = void 0;
const AbstractGrpcServer_1 = require("@/servers/AbstractGrpcServer");
const fs_1 = __importDefault(require("fs"));
const testConfigs_1 = require("../testConfigs");
class TestGrpcServer extends AbstractGrpcServer_1.AbstractGrpcServer {
    constructor(protoPath) {
        super(protoPath);
    }
    getHandler = async (call) => {
        console.log("GET REQUEST");
        call.write({
            info: {
                requestType: call.request.requestType,
                dataType: "FILE"
            }
        });
        const fileStream = fs_1.default.createReadStream(testConfigs_1.testConfigs.dataPath);
        fileStream.on("data", data => {
            call.write({
                chunkData: data
            });
        });
        fileStream.on("end", () => call.end());
    };
    setHandler = (call, callback) => {
        console.log("SET REQUEST");
        call.on("data", data => {
            console.log(data.infoOrData == "info" ? data.info : data.chunkData.toString());
        });
        call.on("end", () => {
            callback(null, {
                taskGetInfo: {
                    taskId: "123123"
                }
            });
        });
    };
}
exports.TestGrpcServer = TestGrpcServer;
