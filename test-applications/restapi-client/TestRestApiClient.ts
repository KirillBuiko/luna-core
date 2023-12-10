import type {GetRequestInfo} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";
import * as fs from "fs";
import * as path from "path";
import {Readable} from "node:stream";

export class TestRestApiClient {
    constructor(private host) {

    }

    async get(info: GetRequestInfo) {
        // @ts-ignore
        Readable.fromWeb((await fetch(`http://${this.host}/get` +
            `?info=${JSON.stringify(info)}`, {
            method: "GET",
        })).body).on("data", data => {
            console.log(data.toString());
        });
    }

    async set(info: DataRequestInfo) {
        const form = new FormData();
        form.append("info", JSON.stringify(info));
        form.append("data", await fs.openAsBlob(path.join(__dirname, "..", "test-data.txt")));
        return await fetch(`http://${this.host}/set`, {
            method: "POST",
            // headers: {"Content-Type": "multipart/form-data"},
            body: form,
            // @ts-ignore
            duplex: "half"
        }).then(res => res.text());
    }
}
