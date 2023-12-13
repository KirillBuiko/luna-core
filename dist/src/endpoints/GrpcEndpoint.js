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
exports.GrpcEndpoint = void 0;
const protoLoader = __importStar(require("@grpc/proto-loader"));
const grpcLoadOptions_1 = require("@/grpcLoadOptions");
const grpc = __importStar(require("@grpc/grpc-js"));
const grpc_js_1 = require("@grpc/grpc-js");
const configs_1 = require("@/configs/configs");
const Endpoint_1 = require("@/endpoints/Endpoint");
class GrpcEndpoint extends Endpoint_1.Endpoint {
    status = "not-connected";
    protocol = "GRPC";
    client;
    init(config) {
        const packageDefinition = protoLoader.loadSync(configs_1.configs.PROTO_PATH, grpcLoadOptions_1.grpcLoadOptions);
        const proto = grpc.loadPackageDefinition(packageDefinition);
        this.client = new proto.DataRequests(config.host, grpc.credentials.createInsecure());
        return new Promise(resolve => {
            (0, grpc_js_1.waitForClientReady)(this.client, Date.now() + configs_1.configs.ENDPOINT_CONNECTION_DEADLINE, error => {
                if (!error) {
                    this.status = "connected";
                }
                resolve(error === undefined ? null : error);
            });
        });
    }
    getHandler(info) {
        const get = this.client.get(info);
        return {
            requestName: "GET",
            protocol: "GRPC",
            destReader: get
        };
    }
    setHandler(info) {
        let writer = undefined;
        const reader = new Promise((resolve, reject) => {
            writer = this.client.set((err, value) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(value);
                }
            });
        });
        writer.write({
            info: info
        });
        return {
            requestName: "SET",
            protocol: "GRPC",
            destReader: reader,
            destWriter: writer
        };
    }
}
exports.GrpcEndpoint = GrpcEndpoint;
