import {TestGrpcServer} from "./TestGrpcServer";
import {configs} from "@/configs/configs";
import {testConfigs} from "../testConfigs";


(async function main() {
    try {
        await (new TestGrpcServer(configs.PROTO_PATH)).startDefault(testConfigs.grpcServer);
    }
    catch (e) {
        console.log(`Grpc server start error: ${e}`);
    }
})()