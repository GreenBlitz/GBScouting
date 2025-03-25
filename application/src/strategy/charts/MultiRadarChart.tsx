import React from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  RadarController,
} from "chart.js";
import { Radar } from "react-chartjs-2";

interface RadarInput {
  value: number;
  max: number;
}

type DataSet = Record<string, RadarInput>;

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  RadarController
);

interface MultiRadarChartProps {
  dataSets: Record<string, DataSet>;
}

const MultiRadarChart: React.FC<MultiRadarChartProps> = ({ dataSets }) => {
  const labels = new Set<string>();
  Object.values(dataSets)
    .flatMap((dataSet) => Object.keys(dataSet))
    .forEach((label) => labels.add(label));
  const data = {
    labels: [...labels],

    datasets: Object.entries(dataSets).map(([dataSetName, dataSetValue]) => {
      const [r, g, b] = [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
      ];
      const color = `rgb(${r}, ${g}, ${b})`;
      const opacitatedColor = `rgba(${r}, ${g}, ${b},0.2)`;
      return {
        label: dataSetName,
        data: Object.values(dataSetValue).map(
          (data) => (data.value / data.max) * 100
        ),

        fill: true,
        backgroundColor: opacitatedColor.toString(),
        borderColor: color.toString(),
        pointBackgroundColor: color.toString(),
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: color.toString(),
      };
    }),
  };
  console.log(data);

  return (
    <div>
      <Radar
        data={data}
        options={{
          scales: {
            r: {
              ticks: {
                display: false, // Hides the ticks (units) on the radial scale
              },
              max: 100,
              min: 0,
            },
          },
        }}
      />
    </div>
  );
};

export default MultiRadarChart;
