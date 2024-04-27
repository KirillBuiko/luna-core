import type {EndpointStatus} from "@/app/types/IEndpoint";
import type {
    NarrowedDestinationOptionsType, ProtocolType
} from "@/types/Types";
import type {RemoteStaticEndpointConfigType} from "@/app/types/RemoteStaticEndpointConfigType";
import * as protoLoader from "@grpc/proto-loader";
import {grpcLoadOptions} from "@/grpcLoadOptions";
import * as grpc from "@grpc/grpc-js";
import type {ProtoGrpcType} from "@grpc-build/data_requests";
import type {GetRequestInfo, GetRequestInfo__Output} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";
import {type ClientWritableStream, waitForClientReady} from "@grpc/grpc-js";
import type {DataStream} from "@grpc-build/DataStream";
import {configs} from "@/configs/configs";
import {Endpoint} from "@/endpoints/Endpoint";

export class GrpcEndpoint extends Endpoint {
    status: EndpointStatus = "not-connected"
    protocol: ProtocolType = "GRPC";
    client: InstanceType<ProtoGrpcType["DataRequests"]> | undefined;

    init(config: RemoteStaticEndpointConfigType): Promise<Error | null> {
        const packageDefinition = protoLoader.loadSync(configs.PROTO_PATH, grpcLoadOptions);
        const proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;
        this.client = new proto.DataRequests(config.host, grpc.credentials.createInsecure());
        return new Promise(resolve => {
            waitForClientReady(this.client!, Date.now() + configs.ENDPOINT_CONNECTION_DEADLINE, error => {
                if (!error) {
                    this.status = "connected";
                }
                resolve(error === undefined ? null : error);
            })
        })
    }

    protected getGetHandler(info: GetRequestInfo):
        NarrowedDestinationOptionsType<"GRPC", "GET"> {
        const get = this.client!.get(info);
        return {
            requestName: "GET",
            protocol: "GRPC",
            destReader: get
        }
    }

    protected getSetHandler(info: DataRequestInfo):
        NarrowedDestinationOptionsType<"GRPC", "SET"> {
        let writer: ClientWritableStream<DataStream> | undefined = undefined;
        const reader = new Promise<GetRequestInfo__Output>((resolve, reject) => {
            writer = this.client!.set((err, value) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(value as GetRequestInfo__Output);
                }
            });
        })

        writer.write({
            info: info
        });

        return {
            requestName: "SET",
            protocol: "GRPC",
            destReader: reader,
            destWriter: writer
        }
    }
}


