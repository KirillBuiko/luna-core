import {testServerConfigs} from "../testConfigs";
import {TestRestApiServer} from "./TestRestApiServer";


(async function main() {
    try {
        await (new TestRestApiServer()).defaultStart(testServerConfigs.restServer);
        console.log(`Rest api server started`);
    }
    catch (e) {
        console.log(`Rest api server start error: ${e}`);
    }
})()