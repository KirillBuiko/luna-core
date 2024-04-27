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
            const {sourceWriter} = sourceOptions;
            sourceWriter(null, {
                info: {
                    requestType: info.requestType,
                    dataType: "FILE",
                    codeFragment: {
                        fileInfo: {
                            filename: "test.txt"
                        }
                    }
                },
                data: fs.createReadStream(testConfigs.dataPath)
            })
        } else {
            const {sourceReader: reader, sourceWriter: writer} = sourceOptions;
            console.log(info);
            reader
                .on("data", data => {
                    console.log("DATA", data.toString())
                })
                .on("end", () => writer(null, testObjects.get))
                .on("error", err => writer(err))
        }
    }
}
