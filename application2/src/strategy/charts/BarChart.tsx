import { Chart, CategoryScale, LinearScale, BarElement } from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";

Chart.register(CategoryScale, LinearScale, BarElement);

type DataSet = [Color, Record<string, number>];
type Color = string;
interface BarChartProps {
  dataSets: Record<string, DataSet>;
}
const BarChart: React.FC<BarChartProps> = ({ dataSets }) => {
  const data = {
    labels: Object.keys(Object.values(dataSets)[0][1]),

    datasets: Object.entries(dataSets).map(([dataSetName, dataSetValue]) => {
      return {
        label: dataSetName,
        backgroundColor: [...Array(Object.values(dataSetValue[1]).length)].map(
          () => dataSetValue[0]
        ),
        data: Object.values(dataSetValue[1]),
      };
    }),
  };

  return (
    <div style={{ width: "100%", maxWidth: "600px" }}>
      <Bar data={data} />
    </div>
  );
};

export default BarChart;
