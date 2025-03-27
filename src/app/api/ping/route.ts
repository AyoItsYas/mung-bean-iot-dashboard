import Logger from "@/utility/logging.utility";

const logger = new Logger(import.meta.url);

export async function GET() {
	logger.log("pong!", logger.LogLevel.INFO);

	const data = { message: "pong!" };

	return Response.json({ ...data });
}
