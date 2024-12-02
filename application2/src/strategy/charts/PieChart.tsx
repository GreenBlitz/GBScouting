import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  pieData: Record<string, [number, string]>;
}

const PieChart: React.FC<PieChartProps> = ({ pieData }) => {
  const names = Object.keys(pieData);
  const data = Object.values(pieData).map(([num, _]) => {
    return num;
  });
  const backgroundColor = Object.values(pieData).map(([_, color]) => {
    return color;
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
