import {Logger} from "../utils/logger";
import {runKiller} from "../utils/killer";
import {serverConfigs} from "../configs/serverConfigs";
import {delay} from "../utils/delay";

export const uiLogger = new Logger(__dirname, "UI");

async function getRequest(url: string): Promise<string> {
	const form = await (await fetch(url)).formData();
	const data = form.get("data");
	if(!data || typeof data === "object") {
		await uiLogger.info("Data field is invalid");
		throw new Error("Data field is invalid");
	}
	return data;
}

async function deleteRequest(url: string): Promise<void> {
	await fetch(url, {method: "DELETE"});
	return;
}

(async function() {
	await runKiller(__dirname);
	await uiLogger.info("Running UI...");

	const serverConfig = serverConfigs.restApiServer;

	const startTime = Date.now();
	await uiLogger.info("///  1. Setting up variable values ///");
	for(let i = 0; i < 5; i++) {
		const formData  = new FormData();
		formData.set("data", new Blob([`Variable value ${i}`], {
			type: "application/octet-stream",
		}))
		const resp = await (await fetch(`http://${serverConfig.host}:${serverConfig.port}/api/v2/var-storage/value`, {
			method: "POST",
			body: formData
		})).json();
		await uiLogger.info("New value ID: ", resp.id);
		await delay(10);
	}

	await uiLogger.info("///  2. Variable values list request ///");
	const listResp1 = await getRequest(`http://${serverConfig.host}:${serverConfig.port}/api/v2/var-storage/list`);
	const list1: string[] = JSON.parse(listResp1);
	await uiLogger.info("First list: ", list1);

	await uiLogger.info("///  3. Variable values fetch ///");
	await Promise.all(list1.map(async (id) => {
		const resp = await getRequest(`http://${serverConfig.host}:${serverConfig.port}/api/v2/var-storage/value/${id}`);
		await uiLogger.info(`ID: ${id}, value: ${resp}`);
	}))

	await uiLogger.info("///  4. Variable values deleting ///");
	await Promise.all(list1.map(async (id) => {
		const resp = await deleteRequest(`http://${serverConfig.host}:${serverConfig.port}/api/v2/var-storage/value/${id}`);
		await uiLogger.info(`Deleted: ${id}`);
	}))

	await uiLogger.info("///  5. Variable values list request #2 ///");
	const listResp2 = await getRequest(`http://${serverConfig.host}:${serverConfig.port}/api/v2/var-storage/list`);
	const list2: string[] = JSON.parse(listResp2);
	await uiLogger.info("Second list: ", list2);
	await uiLogger.info("/////  Execution time:", (Date.now() - startTime)/1000);
})()
