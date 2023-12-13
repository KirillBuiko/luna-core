"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestApiServer = void 0;
const AbstractRestApiServer_1 = require("@/servers/AbstractRestApiServer");
const ErrorMessage_1 = require("@/utils/ErrorMessage");
const constants_1 = require("@grpc/grpc-js/build/src/constants");
const EndedStream_1 = require("@/utils/EndedStream");
const getReaderWriter_1 = require("@/utils/getReaderWriter");
class RestApiServer extends AbstractRestApiServer_1.AbstractRestApiServer {
    requestManager;
    constructor() {
        super();
    }
    async start(config, requestManager) {
        this.requestManager = requestManager;
        return super.defaultStart(config);
    }
    stop() {
        this.status = "off";
        return this.server.close();
    }
    sendError(res, code, message) {
        res.code(500).send(ErrorMessage_1.ErrorMessage.create(code, message));
    }
    getHandler = (req, res) => {
        const [r, writer] = (0, getReaderWriter_1.getReaderWriter)();
        res.send(r);
        this.requestManager.register({
            protocol: "REST_API",
            requestName: "GET",
            writer: writer,
        }, JSON.parse(req.query.info));
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
            return this.sendError(res, constants_1.Status.INVALID_ARGUMENT, "Data not given for not JSON");
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
        this.requestManager.register({
            protocol: "REST_API",
            requestName: "SET",
            sourceReader: file,
            writer: unaryCallback
        }, info);
        return promise;
    };
}
exports.RestApiServer = RestApiServer;
