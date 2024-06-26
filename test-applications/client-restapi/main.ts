import {TestRestApiClient} from "./TestRestApiClient";
import {testObjects} from "../testObjects";
import {testClientConfigs} from "../testConfigs";

(async function main() {
    try {
        const client = new TestRestApiClient();
        await client.init(testClientConfigs.coreRestServer);
        // await client.get(testObjects.get);
        await client.set(testObjects.set);
    } catch (e) {
        console.log(`Fetch error: ${e}`);
    }
})();
