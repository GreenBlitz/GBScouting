import React, { CSSProperties } from "react";
import { Color } from "../../utils/Color";
import { Unstable_Popup as Popup } from "@mui/base/Unstable_Popup";

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

const boxThickness = 5;

class LinearHistogramChart<
  SectionNames extends string | number,
  PartialSectionNames extends SectionNames
> extends React.Component<
  LinearHistogramProps<SectionNames, PartialSectionNames>,
  { hoveredSection?: Section<PartialSectionNames>; anchor?: HTMLElement }
> {
  private readonly canvasRef;
  private readonly sectionWidths: Section<PartialSectionNames>[];
  private readonly sumOfSectionValues: number;

  constructor(props: LinearHistogramProps<SectionNames, PartialSectionNames>) {
    super(props);
    this.canvasRef = React.createRef<HTMLCanvasElement>();
    this.state = { hoveredSection: undefined, anchor: undefined };

    this.sumOfSectionValues = this.props.sections.reduce<number>(
      (accumulator, section) => accumulator + section.value,
      0
    );
    this.sectionWidths = props.sections.map(({ value, sectionName }) => {
      return {
        value: this.amountToCanvasWidth(value),
        sectionName: sectionName,
      };
    });
  }

  amountToCanvasWidth(value: number) {
    const canvasWidth = this.props.width - 2 * boxThickness;
    return (value * canvasWidth) / this.sumOfSectionValues;
  }
  amountFromCanvasWidth(value: number) {
    const canvasWidth = this.props.width - 2 * boxThickness;
    return (value * this.sumOfSectionValues) / canvasWidth;
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

  getSection(xValue: number): Section<PartialSectionNames> | undefined {
    let currentXPosition = 0;
    console.log(this.sectionWidths);
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
      hoveredSection.value = this.amountFromCanvasWidth(hoveredSection.value);
    }
    this.setState({
      anchor: event.currentTarget,
      hoveredSection: hoveredSection,
    });
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
      <div
        style={{
          ...this.props.style,
          height: this.props.height,
          width: this.props.width,
        }}
        onMouseMove={(event) => this.onMove(event)}
        onMouseLeave={() => this.setState({ hoveredSection: undefined })}
      >
        <canvas
          width={this.props.width}
          height={this.props.height}
          ref={this.canvasRef}
        />
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
