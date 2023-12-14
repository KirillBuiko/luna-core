import {TestGrpcClient} from "./TestGrpcClient";
import {testObjects} from "../testObjects";
import {testClientConfigs} from "../testConfigs";


(async function main() {
    try {
        const client = new TestGrpcClient();
        await client.init(testClientConfigs.coreGrpcServer);
        // client.get(testObjects.get);
        client.set(testObjects.set);
    } catch (e) {
        console.log(`Grpc request error: ${e}`);
    }
})()
