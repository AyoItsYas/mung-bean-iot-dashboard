import { z } from "zod";

import connect from "@/config/database.config";

import Logger from "@/utility/logging.utility";
import respond from "@/utility/respond.utility";

import { MAC_ADDRESS_REGEX } from "@/constants/common.constants";

import type { NextRequest } from "next/server";

const logger = new Logger(import.meta.url);

const bodySchema = z.object({
	macAddress: z.string().regex(MAC_ADDRESS_REGEX),
});

type Body = z.infer<typeof bodySchema>;

type Data = {
	id: number;
	macAddress: string;
};

export async function POST(request: NextRequest) {
	return respond<Body, Data>(
		request,
		async (dataIn) => {
			logger.log(`received request with macAdress: ${dataIn.macAddress}`);

			const db = await connect();

			const dataOut = {
				id: 0,
				macAddress: dataIn.macAddress,
			};

			return { dataOut, message: "success" };
		},
		bodySchema,
	);
}
