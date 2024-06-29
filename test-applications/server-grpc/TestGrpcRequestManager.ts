import type {NarrowedSource} from "@/types/general";
import type {IRequestManager} from "@/request-manager/types/IRequestManager";
import type {GetInfo} from "@grpc-build/GetInfo";
import type {DataInfo} from "@grpc-build/DataInfo";
import fs from "fs";
import {testConfigs} from "../testConfigs";
import {testObjects} from "../testObjects";

export class TestGrpcRequestManager implements IRequestManager {
    async register(sourceOptions: NarrowedSource<"GRPC">, info: GetInfo | DataInfo) {
        if (sourceOptions.requestName == "GET") {
            console.log("GET REQUEST");
            const {sourceWriter} = sourceOptions;
            sourceWriter!.write({
                info: testObjects.set
            })
            const fileStream = fs.createReadStream(testConfigs.dataPath);
            fileStream
                .on("data", data => sourceWriter!.write({chunkData: data}))
                .on("end", () => sourceWriter!.end())
                .on("error", err => sourceWriter!.destroy(err))
        } else {
            console.log("SET REQUEST");
            const {sourceReader: reader, sourceWriter: writer} = sourceOptions;
            reader!
                .on("data", data =>
                    console.log(data.infoOrData == "info" ? data.info : data.chunkData.toString()))
                .on("end", () => writer!(null, testObjects.get))
                .on("error", err => writer!(err))
        }
    }
}
