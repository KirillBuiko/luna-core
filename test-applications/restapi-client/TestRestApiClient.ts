import type {GetRequestInfo} from "@grpc-build/GetRequestInfo";
import {serverConfigs} from "@/configs/serverConfigs";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";
import * as fs from "fs";
import * as path from "path";

export class TestRestApiClient {
    constructor() {
    }

    async get(info: GetRequestInfo) {
        return await fetch(`http://localhost:${serverConfigs["restApiServer"].port}/get` +
            `?info=${JSON.stringify(info)}`, {
            method: "GET",
        })
    }

    async set(info: DataRequestInfo) {
        const form = new FormData();
        form.append("info", JSON.stringify(info));
        form.append("data", await fs.openAsBlob(path.join(__dirname, "..", "test-data.txt")));
        return await fetch(`http://localhost:${serverConfigs["restApiServer"].port}/set`, {
            method: "POST",
            // headers: {"Content-Type": "multipart/form-data"},
            body: form,
            // @ts-ignore
            duplex: "half"
        }).then(res => res.text());
    }
}
