import type {NarrowedSourceOptionsType} from "@/types/Types";
import type {IRequestManager} from "@/app/types/IRequestManager";
import type {GetRequestInfo} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";
import fs from "fs";
import {testConfigs} from "../testConfigs";
import {testObjects} from "../testObjects";

export class TestGrpcRequestManager implements IRequestManager {
    register(sourceOptions: NarrowedSourceOptionsType<"GRPC">, info: GetRequestInfo | DataRequestInfo) {
        if (sourceOptions.requestName == "GET") {
            console.log("GET REQUEST");
            const {writer} = sourceOptions;
            writer.write({
                info: testObjects.set
            })
            const fileStream = fs.createReadStream(testConfigs.dataPath);
            fileStream
                .on("data", data => writer.write({chunkData: data}))
                .on("end", () => writer.end())
                .on("error", err => writer.destroy(err))
        } else {
            console.log("SET REQUEST");
            const {sourceReader: reader, writer: writer} = sourceOptions;
            reader
                .on("data", data =>
                    console.log(data.infoOrData == "info" ? data.info : data.chunkData.toString()))
                .on("end", () => writer(null, testObjects.get))
                .on("error", err => writer(err))
        }
    }
}