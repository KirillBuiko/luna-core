"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRestApiServer = void 0;
const AbstractRestApiServer_1 = require("@/servers/AbstractRestApiServer");
require("@grpc-build/GetRequestInfo");
require("@fastify/multipart");
const constants_1 = require("@grpc/grpc-js/build/src/constants");
require("@fastify/busboy");
require("@grpc-build/DataRequestInfo");
const EndedStream_1 = require("@/utils/EndedStream");
require("@grpc/grpc-js");
const fs_1 = __importDefault(require("fs"));
const testConfigs_1 = require("../testConfigs");
const getReaderWriter_1 = require("@/utils/getReaderWriter");
require("fastify");
const ErrorMessage_1 = require("@/utils/ErrorMessage");
const testObjects_1 = require("../testObjects");
class TestRestApiServer extends AbstractRestApiServer_1.AbstractRestApiServer {
    constructor() {
        super();
    }
    sendError(res, code, message) {
        res.code(500).send(ErrorMessage_1.ErrorMessage.create(code, message));
    }
    getHandler = (req, res) => {
        const info = JSON.parse(req.query.info);
        const [r, writer] = (0, getReaderWriter_1.getReaderWriter)();
        const getInfo = (0, testObjects_1.getDataInfo)(info.requestType);
        res.send(r);
        writer.write(JSON.stringify(info));
        fs_1.default.createReadStream(testConfigs_1.testConfigs.dataPath).pipe(writer);
    };
    setHandler = async (req, res) => {
        let parts;
        try {
            parts = req.parts();
            if (!parts) {
                return this.sendError(res, constants_1.Status.INVALID_ARGUMENT, "Body is not multipart");
            }
        }
        catch (e) {
            console.log(e);
            return this.sendError(res, constants_1.Status.INVALID_ARGUMENT, "Body is not multipart");
        }
        let infoString;
        let file;
        for (let i = 0; i < 2; i++) {
            const part = (await parts.next()).value;
            if (!part)
                continue;
            if (part.type == "field" && part.fieldname == "info")
                infoString = part.value;
            if (part.type == "file")
                file = part.file;
        }
        if (!infoString) {
            return this.sendError(res, constants_1.Status.INVALID_ARGUMENT, "Info not given");
        }
        const info = JSON.parse(infoString);
        if (info.dataType != "JSON" && !file) {
            return this.sendError(res, constants_1.Status.INVALID_ARGUMENT, "Data not given for not JSON data type");
        }
        if (!file) {
            file = new EndedStream_1.EndedStream();
        }
        let unaryCallback;
        const promise = new Promise((resolve, reject) => {
            unaryCallback = (error, value) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(value);
                }
            };
        });
        file
            .on("data", data => console.log(data.toString()))
            .on("end", () => { unaryCallback(null, testObjects_1.getProgramInfo); })
            .on("error", err => { unaryCallback(err); });
        return promise;
    };
}
exports.TestRestApiServer = TestRestApiServer;
