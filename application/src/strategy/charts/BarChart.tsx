import { Chart, CategoryScale, LinearScale, BarElement } from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";
import { DataSet } from "../../utils/Utils";

Chart.register(CategoryScale, LinearScale, BarElement);

interface BarChartProps {
  dataSets: Record<string | number, DataSet>;
  isStacked?: boolean;
}
const BarChart: React.FC<BarChartProps> = ({
  dataSets,
  isStacked,
}: BarChartProps) => {
  const labels = new Set<string>();
  Object.values(dataSets)
    .flatMap((dataSet) => Object.keys(dataSet.data))
    .forEach((label) => labels.add(label));
  const data = {
    labels: [...labels],

    datasets: Object.entries(dataSets).map(([dataSetName, dataSetValue]) => {
      return {
        label: dataSetName,
        backgroundColor: Object.values(dataSetValue.data).map(() =>
          dataSetValue.color.toString()
        ),
        borderWidth: 3,
        data: Object.values(dataSetValue.data),
      };
    }),
  };

  return (
    <div style={{ width: "600px" }}>
      <Bar
        data={data}
        options={{
          scales: {
            x: {
              stacked: isStacked,
            },
            y: {
              stacked: isStacked,
            },
          },
        }}
      />
    </div>
  );
};

export default BarChart;
