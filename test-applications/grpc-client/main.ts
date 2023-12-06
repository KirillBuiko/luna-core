import {TestGrpcClient} from "./TestGrpcClient";


(async function main() {
    try {
        await (new TestGrpcClient()).get();
    }
    catch (e) {
        console.log(`Grpc request error: ${e}`);
    }
})()
