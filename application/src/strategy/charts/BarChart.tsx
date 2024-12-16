import { Chart, CategoryScale, LinearScale, BarElement } from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";
import { Color } from "../../utils/Color";

Chart.register(CategoryScale, LinearScale, BarElement);
 
interface DataSet {
  color: Color;
  data: Record<string,number>;
}
interface BarChartProps {
  dataSets: Record<string, DataSet>;
}
const BarChart: React.FC<BarChartProps> = ({ dataSets }) => {
  const data = {
    labels: Object.keys(Object.values(dataSets)[0].data),

    datasets: Object.entries(dataSets).map(([dataSetName, dataSetValue]) => {
      return {
        label: dataSetName,
        backgroundColor: [...Array(Object.values(dataSetValue.data).length)].map(
          () => dataSetValue.color
        ),
        data: Object.values(dataSetValue.data),
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
