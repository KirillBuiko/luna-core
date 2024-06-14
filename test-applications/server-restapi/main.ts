import {testServerConfigs} from "../testConfigs";
import {RestApiServer} from "@/servers/rest-api/RestApiServer";
import {TestRestApiRequestManager} from "./TestRestApiRequestManager";


(async function main() {
    try {
        const server = new RestApiServer();
        const err = await server.start(testServerConfigs.restServer, new TestRestApiRequestManager());
        if (err) {
            console.log(`Rest api server start error: ${err}`);
        } else {
            console.log(`Rest api server started on ${testServerConfigs.restServer.port}`);
        }
    }
    catch (e) {
        console.log(`Rest api server start error: ${e}`);
    }
})()
