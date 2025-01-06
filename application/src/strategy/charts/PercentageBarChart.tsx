import React from "react";
import { Color } from "../../utils/Color";
import { AgGauge, AgGaugeProps } from "ag-charts-react";

interface PercentageBarProps {
  width: number;
  height: number;
  sections: Section[];
}

interface Section {
  name: string;
  value: number;
  color: Color;
}

const PercentageBarChart: React.FC<PercentageBarProps> = ({
  width,
  height,
  sections,
}) => {
  const options: AgGaugeProps = {
    options: {
      type: "linear-gauge",
      value: 85,
    },
  };
  return <AgGauge {...options} />;
};

export default PercentageBarChart;
