import {Logger} from "../utils/logger";
import {runKiller} from "../utils/killer";
import {initVariableStorageOperator} from "./variable-storages-operator";

export const operatorsLogger = new Logger(__dirname, "OPERATORS");

(async function() {
	await runKiller(__dirname);
	operatorsLogger.info("Running operators...");
	await initVariableStorageOperator();
})()
