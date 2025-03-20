import path from "path";
import fs from "fs/promises";

export async function runKiller(dirName: string) {
	const pid = process.pid.toString();
	const filePath = path.join(dirName, "pid.txt");
	try {
		const lastPid = Number((await fs.readFile(filePath)).toString());
		if (lastPid) {
			process.kill(lastPid);
		}
	} catch {
		// file not exist
	}
	finally {
		await fs.writeFile(filePath, pid);
	}
}