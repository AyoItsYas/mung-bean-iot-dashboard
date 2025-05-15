import mongoose from "mongoose";

import Logger from "@/utility/logging.utility";
import environment from "@/config/env.config";

const logger = new Logger(import.meta.url);

// connecting to database
export const connect = async () => {
	if (mongoose.connection.readyState === 1) {
		logger.log("cached connection", logger.LogLevel.DEBUG);
		return;
	}

	const connString = environment.databaseURI;

	try {
		await mongoose.connect(connString);
		logger.log("database connection has been established successfully");
	} catch (e) {
		logger.log(e);
	}
};

export const disconnect = async () => {
	try {
		logger.log("database connection has been closed successfully");
		await mongoose.disconnect();
	} catch (error) {
		logger.log(error);
	}
};

export default connect;
