import { z } from "zod";

import Logger from "@/utility/logging.utility";
import respond, { ResponseSafeError } from "@/utility/respond.utility";

import connect from "@/config/database.config";

import UnitModel from "@/models/unit.model";
import UnitReportModel from "@/models/unit/report.model";
import UnitCommandModel from "@/models/unit/command.model";

import { MAC_ADDRESS_REGEX } from "@/constants/common.constants";

import type { NextRequest } from "next/server";

const logger = new Logger(import.meta.url);

type Data = {
  id: number;
};

const bodySchema = z.object({
  token: z.string().length(17),
  macAddress: z.string().regex(MAC_ADDRESS_REGEX),
});

type Body = z.infer<typeof bodySchema>;

function turnOnBulb(internalTemp: number) {
  return internalTemp < 25;
}

function turnOnWaterPump(moisture: number) {
  return moisture < 80;
}

export async function POST(request: NextRequest) {
  return respond<Body, Data>(
    request,
    async (dataIn) => {
      logger.log("unit command");
      logger.log(dataIn.macAddress);

      await connect();

      const unit = await UnitModel.findOne({ macAddress: dataIn.macAddress });

      if (!unit) {
        throw new ResponseSafeError("unit not found");
      }

      if (unit.token !== dataIn.token) {
        throw new ResponseSafeError("invalid token");
      }

      return { message: "success", commands: [0, 1] };
      // return { message: "success", commands: [0, 9] };

      const reports = await UnitReportModel.find({
        unitId: unit._id,
        createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) },
      });

      const last10MinuteReports = await UnitReportModel.find({
        unitId: unit._id,
        createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) },
      });

      const averageInternalTemp =
        reports.length > 0
          ? reports.reduce(
              (sum, report) => sum + (report.internalTemperature ?? 0),
              0
            ) / reports.length
          : 0;

      const averageMoisture =
        reports.length > 0
          ? reports.reduce((sum, report) => sum + (report.moisture ?? 0), 0) /
            reports.length
          : 0;

      const averagePressure =
        last10MinuteReports.length > 0
          ? last10MinuteReports.reduce(
              (sum, report) => sum + (report.pressure ?? 0),
              0
            ) / last10MinuteReports.length
          : 0;

      const commands = [0];

      if (turnOnBulb(averageInternalTemp)) {
        commands.push(9);
      } else {
        commands.push(10);
      }

      if (turnOnWaterPump(averageMoisture) && averagePressure > 1000) {
        commands.push(1);
      } else {
        commands.push(2);
      }

      return { message: "success", commands: commands };
    },
    bodySchema
  );
}
