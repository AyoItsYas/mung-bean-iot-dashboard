"use server";

import connect from "@/config/database.config";

import UnitReportModel from "@/models/unit/report.model";

import { InternalsChart } from "@/components/dashboard/internals-chart";
import { GrowthChart } from "@/components/dashboard/growth-chart";
import { MoistureChart } from "@/components/dashboard/moisture-chart";
import { WaterTempChart } from "@/components/dashboard/water-temp-chart";

interface UnitReportModelData {
	internalTemperature: number;
	internalHumidity: number;
	moisture: number;
	waterTemperature: number;
	weight: number;
	createdAt: Date;
}

export default async function DashboardPage() {
	await connect();
	const data: UnitReportModelData[] = await UnitReportModel.find({})
		.sort({ createdAt: 1 })
		.limit(3600)
		.exec();

	const chartData = data.map((item) => ({
		internalTemperature: item.internalTemperature,
		internalHumidity: item.internalHumidity,
		waterTemperature: item.waterTemperature,
		moisture: item.moisture,
		weight: item.weight,
		time: item.createdAt.toISOString(),
	}));

	return (
		<div className="space-y-6">
			<div className="px-6 gap-6 flex flex-row">
				<InternalsChart data={chartData} />

				<GrowthChart data={chartData} />
			</div>

			<div className="px-6 gap-6 flex flex-row">
				<WaterTempChart data={chartData} />

				<MoistureChart data={chartData} />
			</div>
		</div>
	);
}
