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
}

const PieChart: React.FC<PieChartProps> = ({ pieData }) => {
  const names = Object.keys(pieData);
  const data = Object.values(pieData).map((section) => {
    return section.percentage;
  });
  const backgroundColor = Object.values(pieData).map((section) => {
    return section.color;
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
    <div>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;
