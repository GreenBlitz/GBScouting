import {
  CategoryScale,
  Chart,
  ChartData,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import React from "react";
import { Line } from "react-chartjs-2";
import { DataSet } from "../../utils/Utils";

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Legend);

const DefaultSize = { width: 400, height: 300 };

interface LineChartProps {
  dataSets: Record<string, DataSet>;
  height?: number;
  width?: number;
}
const LineChart: React.FC<LineChartProps> = ({ dataSets, height, width }) => {
  const data: ChartData<"line", number[], string> = {
    labels: Object.keys(Object.values(dataSets)[0].data),

    datasets: Object.entries(dataSets).map(([dataSetName, dataSetValue]) => {
      return {
        label: dataSetName,
        borderColor: dataSetValue.color.toString(),
        tension: 0.2,
        data: Object.values(dataSetValue.data),
      };
    }),
  };

  return (
    <div style={{ width: "100%", maxWidth: "600px" }}>
      <Line
        height={height || DefaultSize.height}
        width={width || DefaultSize.width}
        data={data}
        options={{
          maintainAspectRatio: true,
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default LineChart;
