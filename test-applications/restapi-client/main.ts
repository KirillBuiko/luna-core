import {TestRestApiClient} from "./TestRestApiClient";
import {getProgramInfo} from "../testObjects";
import {testClientConfigs} from "../testConfigs";


(async function main() {
    try {
        const client = new TestRestApiClient(testClientConfigs.coreRestServer.host);
        console.log(await client.get(getProgramInfo));
        // console.log(await client.set(setProgramInfo));
    } catch (e) {
        console.log(`Fetch error: ${e}`);
    }
})();
