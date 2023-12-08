import {TestRestApiClient} from "./TestRestApiClient";
import type {GetRequestInfo} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";


(async function main() {
    const getInfo: GetRequestInfo = {
        requestType: "PROGRAM",
        variableGetInfo: {
            variableId: "123123"
        }
    }
    const setInfo: DataRequestInfo = {
        requestType: "PROGRAM",
        variableDataInfo: {
            getInfo: {
                variableId: "123123"
            }
        }
    }
    try {
        // console.log(await (new TestRestApiClient()).get(getInfo));
        console.log(await (new TestRestApiClient()).set(setInfo));
    } catch (e) {
        console.log(`Fetch error: ${e}`);
    }
})();
