import { AgChartOptions } from "ag-charts-enterprise";
import { AgCharts } from "ag-charts-react";
import React, { useMemo, useState } from "react";
import "ag-charts-enterprise";

interface BoxProps {
  data: Record<string, number[]>;

  xName: string;
  yName?: string;

  title?: string;
  subtitle?: string;
}

const BoxChart: React.FC<BoxProps> = ({
  data,
  xName,
  yName,
  title,
  subtitle,
}) => {
  const getSection = useMemo(
    () => (name: string, values: number[]) => {
      const sortedValues = [...values].sort((a, b) => a - b);
      return {
        [xName]: name,
        Min: sortedValues[0],
        Max: sortedValues[sortedValues.length - 1],
        Median: sortedValues[Math.floor(sortedValues.length / 2)],
        "Lower Quarter": sortedValues[Math.floor(sortedValues.length / 4)],
        "Upper Quarter":
          sortedValues[Math.floor((sortedValues.length / 4) * 3)],
      };
    },
    []
  );
  const chartOptions: AgChartOptions = useMemo(() => {
    return {
      title: {
        text: title,
      },
      background: {
        fill: "#1f2937",
      },
      theme: "ag-default-dark",
      subtitle: {
        text: subtitle,
      },
      series: [
        {
          type: "box-plot",
          xKey: xName,
          yName: yName,
          minKey: "Min",
          q1Key: "Lower Quarter",
          medianKey: "Median",
          q3Key: "Upper Quarter",
          maxKey: "Max",
        },
      ],
      data: Object.entries(data).map(([name, value]) =>
        getSection(name, value)
      ),
    };
  }, [data]);

  return (
    <div className="">
      <AgCharts className="chart-element" options={chartOptions} />
    </div>
  );
};
export default BoxChart;
