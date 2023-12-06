import type {EndpointStatus, IEndpoint} from "@/app/types/IEndpoint";
import type {
    NarrowedDestinationOptionsType
} from "@/types/Types";
import type {EndpointConfigType} from "@/app/types/EndpointConfigType";
import * as protoLoader from "@grpc/proto-loader";
import {grpcLoadOptions} from "@/grpcLoadOptions";
import * as grpc from "@grpc/grpc-js";
import type {ProtoGrpcType} from "@grpc-build/data_requests";
import type {GetRequestInfo, GetRequestInfo__Output} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";
import {type ClientWritableStream, waitForClientReady} from "@grpc/grpc-js";
import type {DataStream} from "@grpc-build/DataStream";
import {configs} from "@/configs/configs";
import {ProtocolType, RequestName} from "@/types/Enums";

export class GrpcEndpoint implements IEndpoint {
    status: EndpointStatus = "not-connected"
    client: InstanceType<ProtoGrpcType["DataRequests"]> | undefined;

    init(config: EndpointConfigType): Promise<Error | null> {
        const packageDefinition = protoLoader.loadSync('./node_modules/luna-proto-files/data_requests.proto', grpcLoadOptions);
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

    send<RequestN extends RequestName>
    (requestName: RequestN, info: GetRequestInfo | DataRequestInfo):
        NarrowedDestinationOptionsType<ProtocolType.GRPC, RequestName> {
        if (this.status !== "connected") return {protocol: ProtocolType.GRPC, requestName};
        switch (requestName) {
            case RequestName.GET:
                return this.getHandler(info as GetRequestInfo);
            case RequestName.SET:
                return this.setHandler(info as DataRequestInfo);
        }
        return {protocol: ProtocolType.GRPC, requestName}
    }

    private getHandler(info: GetRequestInfo):
        NarrowedDestinationOptionsType<ProtocolType.GRPC, RequestName.GET> {
        const get = this.client!.get(info);
        return {
            requestName: RequestName.GET,
            protocol: ProtocolType.GRPC,
            destReader: get
        }
    }

    private setHandler(info: DataRequestInfo):
        NarrowedDestinationOptionsType<ProtocolType.GRPC, RequestName.SET> {
        let writer: ClientWritableStream<DataStream> | undefined = undefined;
        // TODO: push info in writer stream
        const reader = new Promise<GetRequestInfo__Output>((resolve, reject) => {
            writer = this.client!.set((err, value) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(value as GetRequestInfo__Output);
                }
            });
        })

        return {
            requestName: RequestName.SET,
            protocol: ProtocolType.GRPC,
            destReader: reader,
            destWriter: writer
        }
    }
}


