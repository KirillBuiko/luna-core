"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrpcServer = void 0;
const AbstractGrpcServer_1 = require("@/servers/AbstractGrpcServer");
const configs_1 = require("@/configs/configs");
const ErrorMessage_1 = require("@/utils/ErrorMessage");
const constants_1 = require("@grpc/grpc-js/build/src/constants");
class GrpcServer extends AbstractGrpcServer_1.AbstractGrpcServer {
    requestManager = undefined;
    constructor() {
        super(configs_1.configs.PROTO_PATH);
    }
    async start(config, requestManager) {
        this.requestManager = requestManager;
        return super.defaultStart(config);
    }
    getHandler = (call) => {
        console.log("Get GRPC request", call.request.requestType);
        this.requestManager?.register({
            protocol: "GRPC",
            requestName: "GET",
            writer: call,
            sourceReader: undefined
        }, call.request);
    };
    setHandler = (call, callback) => {
        console.log("Set GRPC request");
        call.once("data", info => {
            if (info.infoOrData === "info") {
                this.requestManager?.register({
                    protocol: "GRPC",
                    requestName: "SET",
                    writer: callback,
                    sourceReader: call
                }, info.info);
            }
            else {
                call.destroy(ErrorMessage_1.ErrorMessage.create(constants_1.Status.FAILED_PRECONDITION, "Not info first"));
            }
        });
    };
}
exports.GrpcServer = GrpcServer;
