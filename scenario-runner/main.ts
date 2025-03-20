import {ChildProcessWithoutNullStreams, spawn} from "node:child_process";
import {Logger} from "../utils/logger";
import {delay} from "../utils/delay";

const runnerLogger = new Logger(__dirname, "R");

async function spawnProcess(name: string, command: string, cwd: string) {
	return new Promise<ChildProcessWithoutNullStreams>((resolve) => {
		runnerLogger.info(`Starting ${name}...`);
		const endpointsProcess = spawn(command, {
			cwd,
			shell: true,
			detached: false,
			stdio: [null, "pipe", "pipe"],
		})
		endpointsProcess.on("spawn", () => {
			resolve(endpointsProcess);
		});
		endpointsProcess.on("error", (error) => {
			throw error;
		});
		endpointsProcess.stdout.on('data', data => {runnerLogger.byPass(String(data)) });
		endpointsProcess.stderr.on('data', data => {runnerLogger.byPass(String(data)) });
		endpointsProcess.on('exit', code => {
			runnerLogger.info(`${name} exited with code ${code}`);
			process.exit();
		});
		return endpointsProcess;
	})
}

async function spawnCore() {
	await spawnProcess("Core", "npm run start-core", "../../luna-core");
	await delay(4000);
	runnerLogger.byPass('\n');
}

async function spawnEndpoints() {
	await spawnProcess("Endpoints", "npm run start", "../test-endpoints");
	await delay(3000);
	runnerLogger.byPass('\n');
}

async function spawnOperators() {
	await spawnProcess("Operators", "npm run start", "../test-operators");
	await delay(2000);
	runnerLogger.byPass('\n');
}

async function spawnUI() {
	await spawnProcess("UI", "npm run start", "../test-ui");
	await delay(2000);
	runnerLogger.byPass('\n');
}

(async function() {
	await spawnCore();
	await spawnEndpoints();
	await spawnOperators();
	// childProcesses.push(await spawnCore());
	// childProcesses.push(await spawnUI());
})()
