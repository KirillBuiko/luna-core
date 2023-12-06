import {TestRestApiClient} from "./TestRestApiClient";

(async function main() {
    try {
        await (new TestRestApiClient()).get();
    }
    catch (e) {
        console.log(`Fetch error: ${e}`);
    }
})()
