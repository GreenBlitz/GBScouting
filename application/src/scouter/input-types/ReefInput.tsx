import { Point } from "chart.js";
import ScouterInput, { InputProps } from "../ScouterInput";
import React from "react";
import { Navigate } from "react-router-dom";
import { getDistance } from "../../utils/Utils";
import { Color } from "../../utils/Color";

const [width, height] = [262, 262];
const stepSize = 30;

interface TriangleMiddle {
  center: Point;
  reefSide: ReefSide;
  name: string;
}

export const triangleButtonMiddles: TriangleMiddle[] = [
  {
    center: { x: 90, y: 200 },
    reefSide: { side: "left", proximity: "close" },
    name: "1",
  },
  {
    center: { x: 50, y: 130 },
    reefSide: { side: "left", proximity: "middle" },
    name: "2",
  },
  {
    center: { x: 90, y: 65 },
    reefSide: { side: "left", proximity: "far" },
    name: "3",
  },
  {
    center: { x: 170, y: 65 },
    reefSide: { side: "right", proximity: "far" },
    name: "4",
  },

  {
    center: { x: 210, y: 130 },
    reefSide: { side: "right", proximity: "middle" },
    name: "5",
  },
  {
    center: { x: 170, y: 200 },
    reefSide: { side: "right", proximity: "close" },
    name: "6",
  },
];

const hexagonRadius = Math.min(width, height) / 2;
const center: Point = { x: width / 2, y: height / 2 };

const hexagonVertices: Point[] = [
  { x: center.x, y: center.y + hexagonRadius },
  {
    x: center.x - (hexagonRadius * Math.sqrt(3)) / 2,
    y: center.y + hexagonRadius / 2,
  },
  {
    x: center.x - (hexagonRadius * Math.sqrt(3)) / 2,
    y: center.y - hexagonRadius / 2,
  },
  { x: center.x, y: center.y - hexagonRadius },

  {
    x: center.x + (hexagonRadius * Math.sqrt(3)) / 2,
    y: center.y - hexagonRadius / 2,
  },

  {
    x: center.x + (hexagonRadius * Math.sqrt(3)) / 2,
    y: center.y + hexagonRadius / 2,
  },
];

export interface ReefSide {
  side: "left" | "right";
  proximity: "far" | "middle" | "close";
}

export interface ReefProps {
  navigationDestination: string;
  triangleColor: Color;
  backgroundColor: Color;
}

class ReefInput extends ScouterInput<
  ReefSide,
  ReefProps,
  { redirectToNext: boolean; coloredTriangleIndex?: number }
> {
  private readonly canvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: InputProps<ReefSide> & ReefProps) {
    super(props);
    this.canvasRef = React.createRef<HTMLCanvasElement>();
  }
  create(): React.JSX.Element {
    return <ReefInput {...this.props} />;
  }
  renderInput(): React.ReactNode {
    if (this.state.redirectToNext) {
      return <Navigate to={this.props.navigationDestination} />;
    }

    return (
      <div
        style={{
          backgroundSize: "100% 100%",
          width: width,
          height: height,
          position: "relative",
        }}
        onTouchStart={(event) => {
          this.setState({
            coloredTriangleIndex: this.getTriangleIndex(event),
          });
        }}
        onTouchEnd={() => this.setState({ coloredTriangleIndex: undefined })}
        onMouseMove={(event) => {
          this.setState({
            coloredTriangleIndex: this.getTriangleIndex(event),
          });
        }}
        onMouseLeave={() => this.setState({ coloredTriangleIndex: undefined })}
        onClick={(event) => this.addSide(this.getSide(event))}
      >
        <canvas ref={this.canvasRef} width={width} height={height} />
      </div>
    );
  }

  getSide(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const clickedPoint = {
      x: event.pageX - event.currentTarget.offsetLeft,
      y: event.pageY - event.currentTarget.offsetTop,
    };

    const minDistance = triangleButtonMiddles.reduce(
      (accumulator, value) =>
        Math.min(accumulator, getDistance(clickedPoint, value.center)),
      width + height
    );

    return (
      triangleButtonMiddles.find(
        (value) =>
          Math.abs(getDistance(clickedPoint, value.center) - minDistance) < 1
      ) || triangleButtonMiddles[0]
    ).reefSide;
  }

  addSide(side: ReefSide) {
    this.storage.set(side);
    this.setState({
      redirectToNext: true,
    });
  }

  getTriangleIndex(
    event:
      | React.TouchEvent<HTMLDivElement>
      | React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    const [touchEvent, mouseEvent] = [
      event as React.TouchEvent<HTMLDivElement>,
      event as React.MouseEvent<HTMLDivElement, MouseEvent>,
    ];
    const clickedPoint = touchEvent.touches
      ? {
          x: touchEvent.touches[0].pageX - event.currentTarget.offsetLeft,
          y: touchEvent.touches[0].pageY - event.currentTarget.offsetTop,
        }
      : {
          x: mouseEvent.pageX - event.currentTarget.offsetLeft,
          y: mouseEvent.pageY - event.currentTarget.offsetTop,
        };
    const minDistance = triangleButtonMiddles.reduce(
      (accumulator, value) =>
        Math.min(accumulator, getDistance(clickedPoint, value.center)),
      width + height
    );
    return triangleButtonMiddles.findIndex(
      (value) =>
        Math.abs(getDistance(clickedPoint, value.center) - minDistance) < 1
    );
  }

  componentDidUpdate(): void {
    this.drawAll();
  }

  componentDidMount(): void {
    this.drawAll();
  }

  drawAll() {
    const canvasContext = this.canvasRef.current
      ? this.canvasRef.current.getContext("2d")
      : null;
    if (canvasContext) {
      canvasContext.clearRect(0, 0, width, height);
      this.drawButtons(canvasContext);
    }
  }

  drawButtons(context: CanvasRenderingContext2D) {
    const middleOfHexagon = { x: width / 2, y: height / 2 };
    hexagonVertices.forEach((vertex, index) => {
      context.beginPath();
      context.fillStyle = this.props.triangleColor.toString();
      if (index === this.state.coloredTriangleIndex) {
        context.fillStyle = "green";
      }
      const nextVertex =
        index === hexagonVertices.length - 1
          ? hexagonVertices[0]
          : hexagonVertices[index + 1];
      context.moveTo(vertex.x, vertex.y);
      context.lineTo(nextVertex.x, nextVertex.y);
      context.lineTo(middleOfHexagon.x, middleOfHexagon.y);
      context.fill();
      context.closePath();

      const centerTriangle = triangleButtonMiddles[index];
      context.fillStyle = "white";
      context.font = "25px Arial";
      context.fillText(
        centerTriangle.name,
        centerTriangle.center.x,
        centerTriangle.center.y
      );
    });

    context.lineWidth = 8;

    hexagonVertices.forEach((point, index) => {
      if (index >= hexagonVertices.length / 2) {
        return;
      }

      const otherPoint = hexagonVertices[index + hexagonVertices.length / 2];

      context.strokeStyle = this.props.backgroundColor.toString();

      context.beginPath();
      context.moveTo(point.x, point.y);
      context.lineTo(otherPoint.x, otherPoint.y);
      context.stroke();
      context.closePath();

      context.strokeStyle = "#90EE90";
      const xDiff = otherPoint.x - point.x;

      if (Math.abs(xDiff) < 0.1) {
        const topPoint =
          Math.max(point.y, otherPoint.y) === point.y ? point : otherPoint;
        const bottomPoint = point === topPoint ? otherPoint : point;

        context.beginPath();
        context.moveTo(topPoint.x, topPoint.y - stepSize);
        context.lineTo(bottomPoint.x, bottomPoint.y + stepSize);
        context.stroke();
        context.closePath();
      }

      const slope = (otherPoint.y - point.y) / xDiff;

      const rightPoint =
        Math.max(point.x, otherPoint.x) === point.x ? point : otherPoint;
      const leftPoint = point === rightPoint ? otherPoint : point;

      context.beginPath();
      context.moveTo(leftPoint.x + stepSize, leftPoint.y + stepSize * slope);
      context.lineTo(rightPoint.x - stepSize, rightPoint.y - stepSize * slope);
      context.stroke();
      context.closePath();
    });

    // context.fillStyle = "red";
    // triangleMiddles.forEach(({ center: point, reefSide: _ }) => {
    //   context.beginPath();
    //   context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
    //   context.fill();
    // });
  }

  initialValue(props: InputProps<ReefSide> & ReefProps): ReefSide {
    return triangleButtonMiddles[0].reefSide;
  }

  getStartingState(
    props: InputProps<ReefSide> & ReefProps
  ): { redirectToNext: boolean; coloredTriangleIndex?: number } | undefined {
    return { redirectToNext: false, coloredTriangleIndex: undefined };
  }
}

export default ReefInput;
