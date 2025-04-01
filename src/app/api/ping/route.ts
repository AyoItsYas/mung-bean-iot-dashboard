import Logger from "@/utility/logging.utility";

import type { NextRequest } from "next/server";

const logger = new Logger(import.meta.url);

export async function GET(request: NextRequest) {
	const data = { message: "pong!" };

	logger.log("pong!", logger.LogLevel.INFO);

	return Response.json({ ...data });
}
