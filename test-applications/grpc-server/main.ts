import {TestGrpcServer} from "./TestGrpcServer";
import {configs} from "@/configs/configs";
import {testServerConfigs} from "../testConfigs";


(async function main() {
    try {
        await (new TestGrpcServer(configs.PROTO_PATH)).defaultStart(testServerConfigs.grpcServer);
        console.log(`Grpc server started`);
    }
    catch (e) {
        console.log(`Grpc server start error: ${e}`);
    }
})()