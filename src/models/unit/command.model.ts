import mongoose from "mongoose";

import { ObjectId } from "mongodb";
import { exec } from "child_process";

const unitCommandSchema = new mongoose.Schema({
  unitId: { type: ObjectId, required: true, ref: "Unit" },
  command: { type: Number, required: true },
  executed: { type: Boolean, default: false },
  executedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UnitCommandModel =
  mongoose.models.UnitCommand ||
  mongoose.model("UnitCommand", unitCommandSchema);

export default UnitCommandModel;
