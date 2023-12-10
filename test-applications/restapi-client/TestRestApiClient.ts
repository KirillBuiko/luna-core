import type {GetRequestInfo} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";
import * as fs from "fs";
import {Readable} from "node:stream";
import {testConfigs} from "../testConfigs";
import FormData from "form-data";

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
        form.append("data", fs.createReadStream(testConfigs.dataPath));
        form.submit({
            host: this.host.split(":")[0],
            port: this.host.split(":")[1],
            path: "/set",
            method: "post"
        }, (err, res) => {
            console.log(err);
            res.on("data", (data) => {
                console.log(data.toString());
            })
        })
    }
}
