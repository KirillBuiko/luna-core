import type {NarrowedSource} from "@/types/Types";
import type {IRequestManager} from "@/app/types/IRequestManager";
import type {GetInfo} from "@grpc-build/GetInfo";
import type {DataInfo} from "@grpc-build/DataInfo";
import {testObjects} from "../testObjects";
import fs from "fs";
import {testConfigs} from "../testConfigs";

export class TestRestApiRequestManager implements IRequestManager {
    async register(sourceOptions: NarrowedSource<"REST_API">, info: GetInfo | DataInfo) {
        if (sourceOptions.requestName == "GET") {
            const {sourceWriter} = sourceOptions;
            sourceWriter!(null, {
                info: {
                    requestType: info.requestType,
                    dataType: ["FILE"]
                },
                data: fs.createReadStream(testConfigs.dataPath)
            })
        } else {
            const {sourceReader: reader, sourceWriter: writer} = sourceOptions;
            console.log(info);
            reader!
                .on("data", data => {
                    console.log("DATA", data.toString())
                })
                .on("end", () => writer!(null, testObjects.get))
                .on("error", err => writer!(err))
        }
    }
}
