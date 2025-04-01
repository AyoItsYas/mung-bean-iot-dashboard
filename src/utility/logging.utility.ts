const LOGGING_PREFIX = "LOG";

enum LogLevel {
	DEBUG = "DEBUG",
	INFO = "INFO",
	ERROR = "ERROR",
}

class Logger {
	location: string;
	LogLevel = LogLevel;

	constructor(location: string) {
		this.location = location.replace(`file://${process.cwd()}`, "");

		this.log("logger initialized", LogLevel.INFO);
	}

	log(message: any, level: LogLevel = LogLevel.DEBUG) {
		let logFunc = console.log;
		switch (level) {
			case LogLevel.DEBUG:
				logFunc = console.debug;
				break;
			case LogLevel.INFO:
				logFunc = console.info;
				break;
			case LogLevel.ERROR:
				logFunc = console.error;
				break;
		}

		logFunc(
			` ${LOGGING_PREFIX} [${level}] ${new Date().toISOString()} (${this.location}): ${message}`,
		);
	}
}

export default Logger;
