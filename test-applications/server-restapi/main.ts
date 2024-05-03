import {testServerConfigs} from "../testConfigs";
import {RestApiServer} from "@/servers/RestApiServer";
import {TestRestApiRequestManager} from "./TestRestApiRequestManager";


(async function main() {
    try {
        const server = new RestApiServer();
        await server.start(testServerConfigs.restServer, new TestRestApiRequestManager());
        console.log(`Rest api server started on ${testServerConfigs.restServer.port}`);
    }
    catch (e) {
        console.log(`Rest api server start error: ${e}`);
    }
})()
