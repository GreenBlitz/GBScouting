import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";
import { Point } from "chart.js";

interface ReefSide {
  side: "left" | "right";
  proximity: "far" | "middle" | "close";
}
const [width, height] = [262, 262];

const triangleMiddles: { center: Point; reefSide: ReefSide }[] = [
  { center: { x: 170, y: 65 }, reefSide: { side: "right", proximity: "far" } },
  {
    center: { x: 210, y: 130 },
    reefSide: { side: "right", proximity: "middle" },
  },
  {
    center: { x: 170, y: 200 },
    reefSide: { side: "right", proximity: "close" },
  },
  { center: { x: 90, y: 65 }, reefSide: { side: "left", proximity: "far" } },
  {
    center: { x: 50, y: 130 },
    reefSide: { side: "left", proximity: "middle" },
  },
  { center: { x: 90, y: 200 }, reefSide: { side: "left", proximity: "close" } },
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

class ReefPickInput extends ScouterInput<
  ReefSide[],
  { setUndo: (undo: () => void) => void }
> {
  private readonly canvasRef: React.RefObject<HTMLCanvasElement>;

  create(): React.JSX.Element {
    return <ReefPickInput {...this.props} />;
  }
  initialValue(props: InputProps<ReefSide[]>): ReefSide[] {
    return [];
  }

  constructor(
    props: InputProps<ReefSide[]> & { setUndo: (undo: () => void) => void }
  ) {
    super(props);
    this.canvasRef = React.createRef<HTMLCanvasElement>();
  }

  undo() {
    const previous = this.getValue();
    previous.splice(previous.length - 1, 1);
    this.storage.set(previous);
  }

  componentDidMount(): void {
    this.props.setUndo(this.undo);

    const canvasContext = this.canvasRef.current
      ? this.canvasRef.current.getContext("2d")
      : null;
    if (canvasContext) {
      this.drawButtons(canvasContext);
    }
  }

  drawButtons(context: CanvasRenderingContext2D) {
    context.fillStyle = "#18723c";
    context.moveTo(hexagonVertices[0].x, hexagonVertices[0].y);
    hexagonVertices.forEach((vertex) => context.lineTo(vertex.x, vertex.y));
    context.fill();
    context.closePath();

    hexagonVertices.forEach((point, index) => {
      if (index >= hexagonVertices.length / 2) {
        return;
      }

      context.strokeStyle = "black";

      context.beginPath();
      context.moveTo(point.x, point.y);
      const otherPoint = hexagonVertices[index + hexagonVertices.length / 2];
      context.lineTo(otherPoint.x, otherPoint.y);
      context.lineWidth = 10;
      context.stroke();
      context.closePath();

      context.beginPath();
      context.moveTo(point.x, point.y);
      context.lineTo(otherPoint.x, otherPoint.y);
      context.lineWidth = 10;
      context.stroke();
      context.closePath();
    });

    // context.fillStyle = "red";
    // triangleMiddles.forEach(({ center: point, reefSide: _ }) => {
    //   context.beginPath();
    //   context.arc(point.x, point.y, 10, 0, 2 * Math.PI);
    //   context.fill();
    // });
  }

  addSide(side: ReefSide) {
    const previous = this.getValue();
    this.storage.set([...previous, side]);
  }

  getSide(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const clickedPoint = {
      x: event.pageX - event.currentTarget.offsetLeft,
      y: event.pageY - event.currentTarget.offsetTop,
    };
    const getDistance = (p1: Point, p2: Point) => {
      return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    };

    const minDistance = triangleMiddles.reduce(
      (accumulator, value) =>
        Math.min(accumulator, getDistance(clickedPoint, value.center)),
      width + height
    );

    return (
      triangleMiddles.find(
        (value) =>
          Math.abs(getDistance(clickedPoint, value.center) - minDistance) < 1
      ) || triangleMiddles[0]
    ).reefSide;
  }

  renderInput(): React.ReactNode {
    return (
      <div
        style={{
          backgroundSize: "100% 100%",
          width: width,
          height: height,
          position: "relative",
        }}
        onClick={(event) => this.addSide(this.getSide(event))}
      >
        <canvas ref={this.canvasRef} width={width} height={height} />
      </div>
    );
  }
}
export default ReefPickInput;
