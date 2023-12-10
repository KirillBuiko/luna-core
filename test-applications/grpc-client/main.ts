import {TestGrpcClient} from "./TestGrpcClient";
import {getProgramInfo} from "../testObjects";
import {configs} from "@/configs/configs";
import {testClientConfigs} from "../testConfigs";


(async function main() {
    try {
        const client = new TestGrpcClient(configs.PROTO_PATH, testClientConfigs.coreGrpcServer.host);
        client.get(getProgramInfo);
        // console.log(await client.set(setProgramInfo));
    }
    catch (e) {
        console.log(`Grpc request error: ${e}`);
    }
})()
