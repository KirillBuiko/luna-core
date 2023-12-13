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
exports.AbstractGrpcServer = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const grpcLoadOptions_1 = require("@/grpcLoadOptions");
class AbstractGrpcServer {
    server = new grpc.Server();
    status = "off";
    constructor(protoPath) {
        const packageDefinition = protoLoader.loadSync(protoPath, grpcLoadOptions_1.grpcLoadOptions);
        const proto = grpc.loadPackageDefinition(packageDefinition);
        // const reflection = new ReflectionService(packageDefinition);
        // reflection.addToServer(this.server);
        this.server.addService(proto.DataRequests.service, {
            Get: (call) => this.getHandler(call),
            Set: (call, callback) => this.setHandler(call, callback)
        });
    }
    defaultStart(config) {
        return new Promise((resolve) => {
            this.server.bindAsync(`0.0.0.0:${config.port}`, grpc.ServerCredentials.createInsecure(), (error) => {
                if (!error) {
                    this.server.start();
                    this.status = "on";
                }
                resolve(error);
            });
        });
    }
    stop() {
        return new Promise((resolve) => {
            this.server.tryShutdown(error => {
                if (!error) {
                    this.status = "off";
                }
                resolve(error);
            });
        });
    }
}
exports.AbstractGrpcServer = AbstractGrpcServer;
