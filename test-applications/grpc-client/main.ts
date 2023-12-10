import {TestGrpcClient} from "./TestGrpcClient";
import {getProgramInfo, setProgramInfo} from "../testObjects";
import {configs} from "@/configs/configs";
import {testClientConfigs} from "../testConfigs";


(async function main() {
    try {
        const client = new TestGrpcClient(configs.PROTO_PATH, testClientConfigs.coreRestServer.host);
        client.get(getProgramInfo);
        console.log(await client.set(setProgramInfo));
    }
    catch (e) {
        console.log(`Grpc request error: ${e}`);
    }
})()
