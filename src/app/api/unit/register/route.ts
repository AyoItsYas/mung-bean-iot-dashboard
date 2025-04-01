import { z } from "zod";

import connect from "@/config/database.config";

import UnitModel from "@/models/unit.model";
import mongoose from "mongoose";

import Logger from "@/utility/logging.utility";
import respond, { ResponseSafeError } from "@/utility/respond.utility";

import { MAC_ADDRESS_REGEX } from "@/constants/common.constants";

import type { NextRequest } from "next/server";
import { MongoServerError } from "mongodb";

const logger = new Logger(import.meta.url);

const bodySchema = z.object({
	macAddress: z.string().regex(MAC_ADDRESS_REGEX),
	token: z.string().length(17),
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
			await connect();

			const unit = new UnitModel(dataIn);

			try {
				await unit.save();
			} catch (error) {
				if (error instanceof MongoServerError) {
					if (error.code === 11000) {
						throw new ResponseSafeError("unit already exists");
					}
				}
			}

			const dataOut = {
				id: unit._id,
				macAddress: dataIn.macAddress,
			};

			return { dataOut, message: "success" };
		},
		bodySchema,
	);
}
