import * as protoLoader from "@grpc/proto-loader";
import {grpcLoadOptions} from "@/grpcLoadOptions";
import * as grpc from "@grpc/grpc-js";
import type {ProtoGrpcType} from "@grpc-build/data_requests";
import {waitForClientReady} from "@grpc/grpc-js";
import {configs} from "@/configs/configs";
import type {EndpointStatus} from "@/app/types/IEndpoint";
import type {GetRequestInfo} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";
import type {DataStream__Output} from "@grpc-build/DataStream";
import fs from "fs";
import {testConfigs} from "../testConfigs";

export class TestGrpcClient {
    status: EndpointStatus = "not-connected"
    client: InstanceType<ProtoGrpcType["DataRequests"]> | undefined;

    constructor(protoPath: string, private host) {
        const packageDefinition = protoLoader.loadSync(protoPath, grpcLoadOptions);
        const proto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;
        this.client = new proto.DataRequests(this.host, grpc.credentials.createInsecure());
        waitForClientReady(this.client!, Date.now() + configs.ENDPOINT_CONNECTION_DEADLINE, error => {
            if (!error) {
                this.status = "connected";
            }
        })
    }

    get(info: GetRequestInfo) {
        const reader = this.client.get(info);
        reader.on("data", (data: DataStream__Output) => {
            data.infoOrData == "info" ? JSON.stringify(data.info) : console.log(data.chunkData.toString());
        })

        reader.on("error", (err) => {
            console.log(err);
        })
    }

    async set(info: DataRequestInfo) {
        const writer = this.client.set((err, resp) => {
            err ? console.log(err) : console.log(JSON.stringify(resp));
        });

        writer.write({info}, () => {
            const file = fs.createReadStream(testConfigs.dataPath);
            file.on("data", data => writer.write({chunkData: data}))
                .on("error", (err) => writer.destroy(err))
                .on("end", () => writer.end());
        });
    }
}