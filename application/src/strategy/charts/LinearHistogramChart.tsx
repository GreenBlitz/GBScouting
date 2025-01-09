import React, { useEffect, useRef } from "react";
import { Color } from "../../utils/Color";
import { Point } from "chart.js";

type SectionColors<T extends keyof any> = Record<T, Color>;
interface Section<PartialNames> {
  value: number;
  sectionName: PartialNames;
}

interface LinearHistogramProps<
  Names extends keyof any,
  PartialNames extends Names
> {
  width: number;
  height: number;

  sectionColors: SectionColors<Names>;
  sections: Section<PartialNames>[];
}

const boxThickness = 5;

class LinearHistogramChart<
  SectionNames extends keyof any,
  PartialSectionNames extends SectionNames
> extends React.Component<
  LinearHistogramProps<SectionNames, PartialSectionNames>
> {
  private readonly canvasRef;
  private readonly sectionWidths: Section<PartialSectionNames>[];

  constructor(props: LinearHistogramProps<SectionNames, PartialSectionNames>) {
    super(props);
    this.canvasRef = React.createRef<HTMLCanvasElement>();

    const canvasWidth = this.props.width - 2 * boxThickness;
    const sumOfSectionValues = this.props.sections.reduce<number>(
      (accumulator, section) => accumulator + section.value,
      0
    );
    this.sectionWidths = props.sections.map(({value, sectionName}) => {
        return {value: (value * canvasWidth) / sumOfSectionValues, sectionName: sectionName}
    })
  }

  initializeBox(context: CanvasRenderingContext2D) {
    context.fillStyle = "black";
    context.fillRect(0, 0, this.props.width, this.props.height);
    context.clearRect(
      boxThickness,
      boxThickness,
      this.props.width - 2 * boxThickness,
      this.props.height - 2 * boxThickness
    );
  }

  fillSections(context: CanvasRenderingContext2D) {
    let currentXPosition = boxThickness;
    this.sectionWidths.forEach(({ value, sectionName }) => {
      const color: Color = this.props.sectionColors[sectionName];
      context.fillStyle = color.toString();
      context.fillRect(
        currentXPosition,
        boxThickness,
        value,
        this.props.height - 2 * boxThickness
      );
      currentXPosition += value;
    });
  }

  getSection(xValue: number, index: number) {
    let currentXPosition = boxThickness;
    this.sectionWidths.find(({value, sectionName}) => {
        currentXPosition += value;
    })
  }

  componentDidMount(): void {
    if (this.canvasRef) {
      const context = this.canvasRef.current
        ? this.canvasRef.current.getContext("2d")
        : null;
      if (context) {
        this.initializeBox(context);
        this.fillSections(context);
      }
    }
  }
  render() {
    return (
      <div>
        <canvas
          width={this.props.width}
          height={this.props.height}
          ref={this.canvasRef}
        />
      </div>
    );
  }
}

export default LinearHistogramChart;