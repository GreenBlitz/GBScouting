import React, { CSSProperties } from "react";
import { Color } from "../../utils/Color";
import { Unstable_Popup as Popup } from "@mui/base/Unstable_Popup";
import { AgGauge, AgGaugeProps } from "ag-charts-react";
import "ag-charts-enterprise";
import { AgGaugeColorStop } from "ag-charts-enterprise";

type SectionColors<T extends string | number> = Record<T, Color>;
interface Section<PartialNames> {
  value: number;
  sectionName: PartialNames;
}

interface LinearHistogramProps<
  Names extends string | number,
  PartialNames extends Names
> {
  width: number;
  height: number;
  style?: CSSProperties;

  sectionColors: SectionColors<Names>;
  sections: Section<PartialNames>[];
}

const boxThickness = 20;
const totalBoxWidth = 2 * boxThickness;

const basicGaugeProps: AgGaugeProps = {
  options: {
    background: {
      fill: "#111827",
    },
    type: "linear-gauge",
    direction: "horizontal",
    value: 100,

    theme: "ag-default-dark",
    cornerRadius: 5,
    cornerMode: "container",
  },
};

class LinearHistogramChart<
  SectionNames extends string | number,
  PartialSectionNames extends SectionNames
> extends React.Component<
  LinearHistogramProps<SectionNames, PartialSectionNames>,
  { hoveredSection?: Section<PartialSectionNames>; anchor?: HTMLElement }
> {
  private readonly chartWidth: number;
  private readonly gaugeProps: AgGaugeProps;

  private readonly sectionWidths: Section<PartialSectionNames>[];
  private readonly sumOfSectionValues: number;

  constructor(props: LinearHistogramProps<SectionNames, PartialSectionNames>) {
    super(props);
    this.chartWidth = props.width - totalBoxWidth;

    this.gaugeProps = { ...basicGaugeProps };
    this.gaugeProps.options.width = props.width;

    let sectionSum = 0;
    this.gaugeProps.options.segmentation = {
      enabled: true,
      interval: {
        values: props.sections.map((section) => {
          sectionSum += section.value;
          return sectionSum;
        }),
      },
      spacing: 5,
    };

    this.state = { hoveredSection: undefined, anchor: undefined };

    this.sumOfSectionValues = this.props.sections.reduce<number>(
      (accumulator, section) => accumulator + section.value,
      0
    );
    this.sectionWidths = props.sections.map(({ value, sectionName }) => {
      return {
        value: this.amountToChartWidth(value),
        sectionName: sectionName,
      };
    });

    this.gaugeProps.options.value = this.sumOfSectionValues;
    this.gaugeProps.options.scale = { min: 0, max: this.sumOfSectionValues };

    let currentStop = 0;
    this.gaugeProps.options.bar = {
      fills: props.sections.map((section) => {
        currentStop += section.value;
        currentStop = Math.min(currentStop, this.sumOfSectionValues);

        return {
          color: this.props.sectionColors[section.sectionName],
          stop: currentStop,
        } as AgGaugeColorStop;
      }),
      fillMode: "discrete",
    };
  }

  amountToChartWidth(value: number) {
    return (value * this.chartWidth) / this.sumOfSectionValues;
  }
  amountFromChartWidth(value: number) {
    return (value * this.sumOfSectionValues) / this.chartWidth;
  }

  getSection(xValue: number): Section<PartialSectionNames> | undefined {
    let currentXPosition = 0;
    const section = this.sectionWidths.find(({ value, sectionName }) => {
      currentXPosition += value;

      return xValue < currentXPosition;
    });
    return section ? { ...section } : undefined;
  }

  onMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const hoveredX: number =
      event.pageX - event.currentTarget.offsetLeft - boxThickness;

    const hoveredSection = this.getSection(hoveredX);
    if (hoveredSection) {
      hoveredSection.value = this.amountFromChartWidth(hoveredSection.value);
    }
    this.setState({
      anchor: event.currentTarget,
      hoveredSection: hoveredSection,
    });
  }

  render() {
    return (
      <div
        style={{
          ...this.props.style,
          height: this.props.height,
          width: this.props.width,
        }}
        onMouseMove={(event) => this.onMove(event)}
        onMouseLeave={() => this.setState({ hoveredSection: undefined })}
      >
        <AgGauge {...this.gaugeProps} />
        {this.state.hoveredSection && this.state.anchor && (
          <Popup open={true} anchor={this.state.anchor}>
            {this.state.hoveredSection.sectionName +
              " : " +
              this.state.hoveredSection.value}
          </Popup>
        )}
      </div>
    );
  }
}

export default LinearHistogramChart;
