import type {GetRequestInfo} from "@grpc-build/GetRequestInfo";
import {serverConfigs} from "@/configs/serverConfigs";

export class TestRestApiClient {
    constructor() {
    }

    async get() {
        const info: GetRequestInfo = {
            requestType: "PROGRAM_GENERATE",
            variableGetInfo: {
                variableId: "123123"
            }
        }
        serverConfigs["restApiServer"].port
        await fetch(`http://localhost:${serverConfigs["restApiServer"].port}/get` +
            `?info=${JSON.stringify(info)}`, {
            method: "GET",
        })
    }

    set() {

    }
}
