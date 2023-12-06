import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import type {ProtoGrpcType} from "@grpc-build/data_requests";
import {grpcLoadOptions} from "@/grpcLoadOptions";
import type {IServer, ServerStatus} from "@/app/types/IServer";
import type {DataRequestsHandlers} from "@grpc-build/DataRequests";
import type {ServerConfigType} from "@/app/types/ServerConfigType";
import type {IRequestManager} from "@/app/types/IRequestManager";

import {ProtocolType, RequestName} from "@/types/Enums";

export class GrpcServer implements IServer {
    server = new grpc.Server();
    status: ServerStatus = "off";
    requestManager: IRequestManager | undefined = undefined;

    constructor() {
        const packageDefinition = protoLoader.loadSync('./node_modules/luna-proto-files/data_requests.proto', grpcLoadOptions);
        const proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;
        // const reflection = new ReflectionService(packageDefinition);
        // reflection.addToServer(this.server);
        this.server.addService(proto.DataRequests.service, {
            Get: (call) =>
                this.getHandler(call),
            Set: (call, callback) =>
                this.setHandler(call, callback)
        } as DataRequestsHandlers);
    }

    start(config: ServerConfigType, requestManager: IRequestManager): Promise<Error | null> {
        this.requestManager = requestManager;
        return new Promise((resolve) => {
            this.server.bindAsync(`0.0.0.0:${config.port}`,
                grpc.ServerCredentials.createInsecure(), (error) => {
                if (!error) {
                    this.server.start();
                    this.status = "on";
                }
                resolve(error);
            });
        })
    }

    stop(): Promise<Error | undefined> {
        return new Promise((resolve) => {
            this.server.tryShutdown(error => {
                if(!error) {
                    this.status = "off";
                }
                resolve(error);
            });
        });
    }

    getHandler: DataRequestsHandlers["Get"] = (call) => {
        console.log("Get GRPC request", call.request.requestType);
        this.requestManager?.register({
            protocol: ProtocolType.GRPC,
            requestName: RequestName.GET,
            sourceWriter: call,
            sourceReader: undefined
        }, call.request);
    }

    setHandler: DataRequestsHandlers["Set"] = (call, callback) => {
        console.log("Set GRPC request");
        call.on("data", info => {
            if (info.infoOrData === "info") {
                this.requestManager?.register({
                    protocol: ProtocolType.GRPC,
                    requestName: RequestName.SET,
                    sourceWriter: callback,
                    sourceReader: call
                }, info.info);
            } else {
                call.emit("error", "NOT INFO FIRST");
                throw Error("NOT INFO ERROR");
            }
        })
    }
}
