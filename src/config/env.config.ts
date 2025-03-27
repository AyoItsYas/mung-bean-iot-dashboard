import { ENVIRONMENTS } from "@/constants/common.constants";
import { config } from "dotenv";
import { expand } from "dotenv-expand";

const env = config();
expand(env);

const environment = {
	isDebugMode:
		process.env.NODE_ENV === ENVIRONMENTS.DEV ||
		process.env.NODE_ENV === ENVIRONMENTS.TEST,
	env: process.env.NODE_ENV as ENVIRONMENTS,
	packageName: process.env.PACKAGE_NAME as string,
	databaseURI: process.env.MONGODB_URI as string,
};

export default environment;
