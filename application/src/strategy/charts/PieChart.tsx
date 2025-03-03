import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Color } from "../../utils/Color";

Chart.register(ArcElement, Tooltip, Legend);

export interface SectionData {
  percentage: number;
  color: Color;
}
interface PieChartProps {
  pieData: Record<string, SectionData>;
  width?: number;
}

const PieChart: React.FC<PieChartProps> = ({ pieData, width }) => {
  const names = Object.keys(pieData);
  const data = Object.values(pieData).map((section) => {
    return section.percentage;
  });
  const backgroundColor = Object.values(pieData).map((section) => {
    return section.color as string;
  });

  const chartData = {
    labels: names,
    datasets: [
      {
        data,
        backgroundColor,
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
      },
    },
  };

  return (
    <div style={{ width }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;
