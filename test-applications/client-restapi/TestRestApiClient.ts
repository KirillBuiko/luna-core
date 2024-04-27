import type {GetRequestInfo__Output} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";
import * as fs from "fs";
import {testConfigs} from "../testConfigs";
import {RestApiEndpoint} from "@/endpoints/RestApiEndpoint";

export class TestRestApiClient extends RestApiEndpoint {
    constructor() {
        super();
    }

    async get(info: GetRequestInfo__Output) {
        const options = super.getGetHandler(info);
        const result = await options.destReader;
        console.log(result.info);
        let file = "";
        if (result.data) {
            result.data.on("data", (value) => {
                file += value;
            });
            result.data.on("end", () => {
                console.log(file);
                console.log("END");
            })
        }
    }

    async set(info: DataRequestInfo) {
        const options = super.getSetHandler(info);
        // options.destWriter.end();
        options.destWriter && fs.createReadStream(testConfigs.dataPath).pipe(options.destWriter);
        options.destReader?.then(data => {
            console.log(data);
        }).catch(err => console.log(err));
    }
}
