import mongoose from "mongoose";

const unitSchema = new mongoose.Schema({
	macAddress: { type: String, required: true, unique: true },
	token: { type: String, required: true },
});

const UnitModel = mongoose.models.Unit || mongoose.model("Unit", unitSchema);

export default UnitModel;
