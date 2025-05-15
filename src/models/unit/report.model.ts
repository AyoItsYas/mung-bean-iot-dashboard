import mongoose from "mongoose";

import { ObjectId } from "mongodb";

const unitReportSchema = new mongoose.Schema({
  unitId: { type: ObjectId, required: true, ref: "Unit" },
  internalTemperature: { type: Number, required: true },
  internalHumidity: { type: Number, required: true },
  moisture: { type: Number, required: true },
  waterTemperature: { type: Number, required: true },
  weight: { type: Number, required: true },
  pressure: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UnitReportModel =
  mongoose.models.UnitReport || mongoose.model("UnitReport", unitReportSchema);

export default UnitReportModel;
