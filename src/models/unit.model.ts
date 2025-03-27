import mongoose from "mongoose";

const unitSchema = new mongoose.Schema({
	macAddress: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

module.exports = mongoose.models.Unit || mongoose.model("Unit", unitSchema);
