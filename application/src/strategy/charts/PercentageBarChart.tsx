import React, { CSSProperties, useEffect, useMemo, useState } from "react";
import { Color } from "../../utils/Color";
import { AgGauge, AgGaugeProps } from "ag-charts-react";
import "ag-charts-enterprise";
import { Unstable_Popup as Popup } from "@mui/base/Unstable_Popup";
import { AgGaugeColorStop } from "ag-charts-enterprise";

interface PercentageBarProps {
  width: number;
  height: number;
  sections: Section[];
  isAlwaysHovered?: boolean;
  style?: CSSProperties;
}

interface Section {
  name: string;
  value: number;
  color: Color;
}
const basicGaugeProps: AgGaugeProps = {
  options: {
    background: {
      fill: "#111827",
    },
    type: "linear-gauge",
    direction: "horizontal",

    value: 100,
    scale: {
      min: 0,
      max: 100,
      label: {
        enabled: false,
      },
    },
    theme: "ag-default-dark",
    cornerRadius: 4,
    cornerMode: "container",
  },
};
const PercentageBarChart: React.FC<PercentageBarProps> = ({
  width,
  height,
  sections,
  style,
  isAlwaysHovered,
}) => {
  const [hoveredSection, setHoveredSection] = useState<Section | undefined>(
    isAlwaysHovered ? sections[0] : undefined
  );

  let sectionValueSum = 0;
  const accumulatedSections = sections.map((section) => {
    const duplicatedSection = { ...section };
    sectionValueSum += section.value;
    duplicatedSection.value = sectionValueSum;
    return duplicatedSection;
  });

  const gaugeProps = useMemo(() => {
    const gauge = { ...basicGaugeProps };
    gauge.options.width = width;
    gauge.options.height = 100;
    gauge.style = style;

    let sectionSum = 0;
    gauge.options.segmentation = {
      enabled: true,
      interval: {
        values: sections.map((section) => {
          sectionSum += section.value;
          return sectionSum;
        }),
      },
      spacing: 5,
    };

    gauge.options.bar = {
      fills: accumulatedSections.map((section) => {
        return {
          color: section.color,
          stop: section.value,
        } as AgGaugeColorStop;
      }),
      fillMode: "discrete",
    };
    return gauge;
  }, [width, sections]);

  const getSection = (xValue: number, startingIndex: number) => {
    if (startingIndex >= accumulatedSections.length) {
      return undefined;
    }
    if (xValue <= accumulatedSections[startingIndex].value) {
      return sections[startingIndex];
    }
    return getSection(xValue - accumulatedSections[0].value, startingIndex + 1);
  };

  const gaugeOffset = width / 10;
  const gaugeWidth = width - 2 * gaugeOffset;

  const onMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const hoveredX: number =
      event.pageX - event.currentTarget.offsetLeft - gaugeOffset;
    if (!isAlwaysHovered) {
      setHoveredSection(getSection((hoveredX * 100) / gaugeWidth, 0));
    }
  };

  return (
    <div
      style={{ width, height }}
      onMouseMove={onMove}
      onMouseLeave={() => (isAlwaysHovered ? {} : setHoveredSection(undefined))}
    >
      <AgGauge {...gaugeProps} />
      {hoveredSection && (
        <h1 className="">
          {hoveredSection.name + " : " + hoveredSection.value + "%"}
        </h1>
      )}
    </div>
  );
};

export default PercentageBarChart;
