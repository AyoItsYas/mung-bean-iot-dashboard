"use server";

import connect from "@/config/database.config";

import UnitReportModel from "@/models/unit/report.model";

import { TestChart } from "@/components/dashboard/test-chart";
import { WeightChart } from "@/components/dashboard/weight-chart";

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
    <div className="px-6 gap-6 flex flex-row">
      <TestChart data={chartData} />

      <WeightChart data={chartData} />
    </div>
  );
}
