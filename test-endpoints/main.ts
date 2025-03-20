import {initVariableStorages} from "./variable-storages";
import {Logger} from "../utils/logger";
import {runKiller} from "../utils/killer";

export const endpointsLogger = new Logger(__dirname, "ENDPOINTS");

(async function(): Promise<void> {
	await runKiller(__dirname);
	endpointsLogger.info("Running endpoints...");
	initVariableStorages();
})()
