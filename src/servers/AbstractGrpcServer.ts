import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import type {ProtoGrpcType} from "@grpc-build/data_requests";
import {grpcLoadOptions} from "@/grpcLoadOptions";
import type {IAbstractServer, ServerStatus} from "@/app/types/IServer";
import type {DataRequestsHandlers} from "@grpc-build/DataRequests";
import type {ServerConfigType} from "@/app/types/ServerConfigType";

export abstract class AbstractGrpcServer implements IAbstractServer {
    server = new grpc.Server();
    status: ServerStatus = "off";

    protected constructor(protoPath: string) {
        const packageDefinition = protoLoader.loadSync(protoPath, grpcLoadOptions);
        const proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;
        // const reflection = new ReflectionService(packageDefinition);
        // reflection.addToServer(this.server);
        this.server.addService(proto.DataRequests.service, {
            Get: (call) =>
                this.getHandler(call),
            Set: (call, callback) =>
                this.setHandler(call, callback),
            Connect: (call) =>
                this.connectHandler(call)
        } as DataRequestsHandlers);
    }

    defaultStart(config: ServerConfigType): Promise<Error | null> {
        return new Promise((resolve) => {
            this.server.bindAsync(`${config.host}:${config.port}`,
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

    abstract getHandler: DataRequestsHandlers["Get"];

    abstract setHandler: DataRequestsHandlers["Set"];

    abstract connectHandler: DataRequestsHandlers["Connect"];
}
