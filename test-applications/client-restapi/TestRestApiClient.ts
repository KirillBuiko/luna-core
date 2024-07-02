import type {GetInfo_Strict} from "@grpc-build/GetInfo";
import type {DataInfo} from "@grpc-build/DataInfo";
import * as fs from "fs";
import {testConfigs} from "../testConfigs";
import {RestApiEndpoint} from "@/endpoints/RestApiEndpoint";

export class TestRestApiClient extends RestApiEndpoint {
    constructor() {
        super();
    }

    async get(info: GetInfo_Strict) {
        const options = super.getGetHandler(info);
        const result = await options.destReader;
        console.log(result!.info);
        if (result!.data) {
            result!.data.pipe(fs.createWriteStream("test.gz"))
            result!.data.on("end", () => {
                console.log("END");
            })
        }
    }

    async set(info: DataInfo) {
        const options = super.getSetHandler(info);
        // options.destWriter?.end();
        options.destWriter && fs.createReadStream(testConfigs.dataPath).pipe(options.destWriter);
        options.destReader?.then(data => {
            console.log(JSON.stringify(data));
        }).catch(err => console.log(err.toString()));
    }
}
