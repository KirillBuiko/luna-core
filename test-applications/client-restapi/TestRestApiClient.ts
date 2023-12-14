import type {GetRequestInfo} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";
import * as fs from "fs";
import {testConfigs} from "../testConfigs";
import {RestApiEndpoint} from "@/endpoints/RestApiEndpoint";

export class TestRestApiClient extends RestApiEndpoint {
    constructor() {
        super();
    }

    async get(info: GetRequestInfo) {
        const options = super.getHandler(info);
        options.destReader.on("data", data => {
            console.log(data.toString());
        })
    }

    async set(info: DataRequestInfo) {
        const options = super.setHandler(info);
        options.destWriter && fs.createReadStream(testConfigs.dataPath).pipe(options.destWriter);
        options.destReader?.then(data => {
            console.log(data);
        }).catch(err => console.log(err));
    }
}
