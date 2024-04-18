import type {NarrowedSourceOptionsType} from "@/types/Types";
import type {IRequestManager} from "@/app/types/IRequestManager";
import type {GetRequestInfo} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";
import {testObjects} from "../testObjects";
import fs from "fs";
import {testConfigs} from "../testConfigs";
import {getReaderWriter} from "@/utils/getReaderWriter";
import FormData from "form-data";

export class TestRestApiRequestManager implements IRequestManager {
    register(sourceOptions: NarrowedSourceOptionsType<"REST_API">, info: GetRequestInfo | DataRequestInfo) {
        if (sourceOptions.requestName == "GET") {
            const {sourceWriter} = sourceOptions;
            const [reader, writer] = getReaderWriter();
            const form = new FormData();
            form.append("info", JSON.stringify(testObjects.set));
            form.append("data", reader);
            form.pipe(sourceWriter);
            fs.createReadStream(testConfigs.dataPath).pipe(writer);
        } else {
            const {sourceReader: reader, sourceWriter: writer} = sourceOptions;
            reader
                .on("data", data =>
                    console.log(data.toString()))
                .on("end", () => writer(null, testObjects.get))
                .on("error", err => writer(err))
        }
    }
}
