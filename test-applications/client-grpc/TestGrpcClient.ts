import type {GetRequestInfo} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";
import type {DataStream__Output} from "@grpc-build/DataStream";
import fs from "fs";
import {testConfigs} from "../testConfigs";
import {GrpcEndpoint} from "@/endpoints/GrpcEndpoint";

export class TestGrpcClient extends GrpcEndpoint {
    constructor() {
        super();
    }

    get(info: GetRequestInfo) {
        const {destReader: reader} = this.getHandler(info);
        reader
            .on("data", (data: DataStream__Output) =>
                console.log(data.infoOrData == "info" ? JSON.stringify(data.info) : data.chunkData.toString()))
            .on("error", (err) => {
                console.log(err);
            })
    }

    set(info: DataRequestInfo) {
        const {destReader: reader, destWriter: writer} = this.setHandler(info);
        fs.createReadStream(testConfigs.dataPath)
            .on("data", data => writer.write({chunkData: data}))
            .on("error", (err) => writer.destroy(err))
            .on("end", () => writer.end());
        reader.then((data) => {
            console.log(data);
        })
    }
}