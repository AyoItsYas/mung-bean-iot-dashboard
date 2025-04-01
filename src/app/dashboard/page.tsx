"use server";

import UnitReportModel from "@/models/unit/report.model";

import { TestChart } from "@/components/dashboard/test-chart";

interface UnitReportModelData {
	internalTemperature: number;
	internalHumidity: number;
	createdAt: Date;
}

export default async function DashboardPage() {
	const data: UnitReportModelData[] = await UnitReportModel.find(
		{},
		{
			internalTemperature: 1,
			internalHumidity: 1,
			createdAt: 1,
		},
	)
		.sort({ createdAt: 1 })
		// .limit(600)
		.exec();

	console.log(data[0]);

	const chartData = data.map((item) => ({
		internalTemperature: item.temperature,
		internalHumidity: item.humidity,
		time: item.createdAt.toISOString(),
	}));

	return (
		<div className="px-6">
			<TestChart data={chartData} />
		</div>
	);
}
