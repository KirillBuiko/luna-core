import {testServerConfigs} from "../testConfigs";
import {GrpcServer} from "@/servers/GrpcServer";
import {TestGrpcRequestManager} from "./TestGrpcRequestManager";


(async function main() {
    try {
        const server = new GrpcServer();
        await server.start(testServerConfigs.grpcServer, new TestGrpcRequestManager());
        console.log(`Grpc server started`);
    }
    catch (e) {
        console.log(`Grpc server start error: ${e}`);
    }
})()