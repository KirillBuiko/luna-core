import type {NarrowedSourceOptionsType} from "@/types/Types";
import type {IRequestManager} from "@/app/types/IRequestManager";
import type {GetRequestInfo} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";
import {testObjects} from "../testObjects";
import fs from "fs";
import {testConfigs} from "../testConfigs";

export class TestRestApiRequestManager implements IRequestManager {
    register(sourceOptions: NarrowedSourceOptionsType<"REST_API">, info: GetRequestInfo | DataRequestInfo) {
        if (sourceOptions.requestName == "GET") {
            console.log("GET REQUEST");
            const {writer} = sourceOptions;
            writer.write(JSON.stringify(testObjects.set));
            fs.createReadStream(testConfigs.dataPath).pipe(writer);
        } else {
            console.log("SET REQUEST");
            const {sourceReader: reader, writer: writer} = sourceOptions;
            reader
                .on("data", data =>
                    console.log(data.toString()))
                .on("end", () => writer(null, testObjects.get))
                .on("error", err => writer(err))
        }
    }
}