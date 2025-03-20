import {createWriteStream, WriteStream} from "node:fs";
import {format} from "node:util";
import path from "path";
import fs from "fs";

type LogLevel = "DEBUG" | "ERROR" | "INFO";

export class Logger {
	file: WriteStream;

	constructor(dirName: string, private loggerName?: string) {
		const logsFolderPath = path.join(dirName, "logs");
		const name = new Date().toLocaleString('ru-RU').replace(/:/g, '꞉') + '.txt';
		const logPath = path.join(logsFolderPath, name);
		fs.mkdirSync(logsFolderPath, {
			recursive: true
		});
		this.file = createWriteStream(logPath, {
			flags: "a+",
		});
	}

	log(level: LogLevel, ...args: any[]) {
		const loggerName = this.loggerName ? `[${this.loggerName}] ` : "";
		const loggerLevel = `[${level}] `;
		const loggerDate = `[${new Date().toLocaleTimeString()}] `;
		const output = `${loggerLevel}${loggerName}${loggerDate} ${format(...args)}`;
		console[level === "ERROR" ? "error" : "log"]?.(output);
		this.file.write(output + '\n');
	}

	byPass(...args: any[]) {
		const output = `${format(...args)}`;
		process.stdout.write(output);
		this.file.write(output);
	}

	info(...args: any[]) {
		return this.log("INFO", ...args);
	}

	error(...args: any[]) {
		return this.log("ERROR", ...args);
	}

	debug(...args: any[]) {
		return this.log("DEBUG", ...args);
	}
}