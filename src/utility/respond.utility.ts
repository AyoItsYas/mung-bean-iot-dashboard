import Logger from "@/utility/logging.utility";

import type { NextRequest } from "next/server";
import { ZodError, type ZodObject, type ZodRawShape } from "zod";

const logger = new Logger(import.meta.url);

type JsonPayload<X> = {
	data?: X;
	message: string;
};

export class ResponseSafeError extends Error {}

export default async function respond<DataInType, DataOutType>(
	request: NextRequest,
	payloadHandler: (dataIn: DataInType) => Promise<JsonPayload<DataOutType>>,
	schema?: ZodObject<ZodRawShape>,
) {
	try {
		const dataIn = await request.json();

		if (schema) {
			try {
				schema.parse(dataIn);
			} catch (error) {
				if (error instanceof ZodError) {
					const message = "invalid request body";
					logger.log(message, logger.LogLevel.INFO);
					return Response.json({ message, error: error.issues });
				}

				throw error;
			}
		}

		const json = await payloadHandler(dataIn);
		return Response.json(json);
	} catch (error: unknown) {
		let safeMessage: string | undefined;

		if (error instanceof ResponseSafeError) {
			safeMessage = error.message;
		} else if (error instanceof Error) {
			logger.log(error.message, logger.LogLevel.ERROR);
		} else {
			logger.log(error);
		}

		return Response.json({ message: safeMessage || "an error occurred" });
	}
}
