import {Logger} from "../utils/logger";
import {runKiller} from "../utils/killer";

export const uiLogger = new Logger(__dirname, "UI");

(async function() {
	await runKiller(__dirname);
	uiLogger.info("Running UI...");
})()
