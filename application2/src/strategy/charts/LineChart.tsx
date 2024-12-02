import {
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import React from "react";
import { Line } from "react-chartjs-2";

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Legend);

type DataSet = [Color, Record<string, number>];
type Color = string;
interface LineChartProps {
  dataSets: Record<string, DataSet>;
  height: number;
  width: number;
}
const LineChart: React.FC<LineChartProps> = ({ dataSets, height, width }) => {
  const data = {
    labels: Object.keys(Object.values(dataSets)[0][1]),

    datasets: Object.entries(dataSets).map(([dataSetName, dataSetValue]) => {
      return {
        label: dataSetName,
        borderColor: dataSetValue[0],
        tension: 0.2,
        data: Object.values(dataSetValue[1]),
      };
    }),
  };

  return (
    <div style={{ width: "100%", maxWidth: "600px" }}>
      <Line
        height={height}
        width={width}
        data={data}
        options={{ maintainAspectRatio: true, responsive: true }}
      />
    </div>
  );
};

export default LineChart;
