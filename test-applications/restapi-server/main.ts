import {testConfigs} from "../testConfigs";
import {TestRestApiServer} from "./TestRestApiServer";


(async function main() {
    try {
        await (new TestRestApiServer()).startDefault(testConfigs.restServer);
    }
    catch (e) {
        console.log(`Rest api server start error: ${e}`);
    }
})()