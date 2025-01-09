import React, { useEffect, useRef } from "react";
import { Color } from "../../utils/Color";

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

  constructor(props: LinearHistogramProps<SectionNames, PartialSectionNames>) {
    super(props);
    this.canvasRef = React.createRef<HTMLCanvasElement>();
  }
  render() {
    const initializeBox = (context: CanvasRenderingContext2D) => {
      context.fillRect(0, 0, this.props.width, this.props.height);
      context.clearRect(
        boxThickness,
        boxThickness,
        this.props.width - 2 * boxThickness,
        this.props.height - 2 * boxThickness
      );
    };

    let sectionValueSum = 0;
    const sectionsAccumulated: Section<PartialSectionNames>[] =
      this.props.sections.map(({ value, sectionName }) => {
        sectionValueSum += value;
        return {
          value: sectionValueSum,
          sectionName: sectionName,
        };
      });
    console.log(sectionsAccumulated);

    // useEffect(() => {
    //   const context = canvasRef.current
    //     ? canvasRef.current.getContext("2d")
    //     : null;
    //   if (context) {
    //     initializeBox(context);
    //   }
    // }, [canvasRef]);
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
