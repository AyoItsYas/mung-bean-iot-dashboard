import { z } from "zod";

import connect from "@/config/database.config";

import UnitModel from "@/models/unit.model";
import UnitReportModel from "@/models/unit/report.model";
import mongoose from "mongoose";

import Logger from "@/utility/logging.utility";
import respond, { ResponseSafeError } from "@/utility/respond.utility";

import { MAC_ADDRESS_REGEX } from "@/constants/common.constants";

import type { NextRequest } from "next/server";
import { MongoServerError } from "mongodb";

const logger = new Logger(import.meta.url);

const bodySchema = z.object({
  token: z.string().length(17),
  macAddress: z.string().regex(MAC_ADDRESS_REGEX),
  internalTemperature: z.number(),
  internalHumidity: z.number(),
  moisture: z.number(),
  waterTemperature: z.number(),
  weight: z.number(),
});

type Body = z.infer<typeof bodySchema>;

type Data = {
  id: number;
};

export async function POST(request: NextRequest) {
  return respond<Body, Data>(
    request,
    async (dataIn) => {
      await connect();

      const unit = await UnitModel.findOne({ macAddress: dataIn.macAddress });

      if (!unit) {
        throw new ResponseSafeError("unit not found");
      }

      if (unit.token !== dataIn.token) {
        throw new ResponseSafeError("invalid token");
      }

      const reportData = {
        unitId: unit._id,
        internalTemperature: dataIn.internalTemperature,
        internalHumidity: dataIn.internalHumidity,
        moisture: dataIn.moisture,
        waterTemperature: dataIn.waterTemperature,
        weight: dataIn.weight,
      };

      const unitReport = new UnitReportModel(reportData);

      try {
        await unitReport.save();
      } catch (error) {
        if (error instanceof MongoServerError) {
          if (error.code === 11000) {
            throw new ResponseSafeError("unit already exists");
          }
        }

        logger.log(error, logger.LogLevel.ERROR);
      }

      return { message: "success" };
    },
    bodySchema
  );
}
