import mongoose from "mongoose";

const unitSchema = new mongoose.Schema({
  macAddress: { type: String, required: true, unique: true },
  token: { type: String, required: true },
  autoControl: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UnitModel = mongoose.models.Unit || mongoose.model("Unit", unitSchema);

export default UnitModel;
