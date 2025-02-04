import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";
import { Point } from "chart.js";
import "../../components/reefScore.css";
import coralSVG from "../../assets/low-coral.svg";
import { Navigate } from "react-router-dom";

interface ReefSide {
  side: "left" | "right";
  proximity: "far" | "middle" | "close";
}

type AlgeaScored = "netScore" | "netMiss" | "processor";
type Collected = "coralFeeder" | "coralGround" | "algeaGround";

type PossibleActions = AlgeaScored | Collected;
type PickedObjective = ReefSide | PossibleActions;

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
  PickedObjective[],
  { navigationDestination: string },
  { objectives: PickedObjective[]; redirectToNext: boolean }
> {
  private readonly canvasRef: React.RefObject<HTMLCanvasElement>;

  create(): React.JSX.Element {
    return <ReefPickInput {...this.props} />;
  }
  initialValue(props: InputProps<PickedObjective[]>): PickedObjective[] {
    return [];
  }

  getStartingState(
    props: InputProps<PickedObjective[]> & {
      navigationDestination: string;
    }
  ): { objectives: PickedObjective[]; redirectToNext: boolean } | undefined {
    return { objectives: this.getValue(), redirectToNext: false };
  }

  constructor(
    props: InputProps<PickedObjective[]> & {
      navigationDestination: string;
    }
  ) {
    super(props);
    this.canvasRef = React.createRef<HTMLCanvasElement>();
  }

  componentDidMount(): void {
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

      context.strokeStyle = "#90EE90";

      context.beginPath();
      context.moveTo(point.x, point.y);
      const otherPoint = hexagonVertices[index + hexagonVertices.length / 2];
      context.lineTo(otherPoint.x, otherPoint.y);
      context.lineWidth = 5;
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
    this.state.objectives.push(side);
    this.setState({ objectives: this.state.objectives, redirectToNext: true });
    this.storage.set(this.state.objectives);
  }

  addAction(action: PossibleActions) {
    this.state.objectives.push(action);
    this.setState(this.state);
    this.storage.set(this.state.objectives);
  }

  getActionValue(action: PossibleActions) {
    return this.state.objectives.filter((value) => value === action).length;
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

  undo() {
    this.state.objectives.pop();
    this.setState(this.state);
    this.storage.set(this.state.objectives);
  }

  renderInput(): React.ReactNode {
    if (this.state.redirectToNext) {
      return <Navigate to={this.props.navigationDestination} />;
    }
    return (
      <div className="flex items-center justify-center flex-col">
        <div className="flex flex-row justify-center mb-4">
          <button
            className="buttonS mr-2 items-center flex flex-col justify-center"
            onClick={() => this.addAction("netScore")}
          >
            <h2 className="text-3xl font-extrabold">NET</h2>
            {this.getActionValue("netScore")}
          </button>
          <button className="buttonF" onClick={() => this.addAction("netMiss")}>
            {this.getActionValue("netMiss")}
          </button>
          <button
            className="buttonS ml-4 mr-2 items-center flex flex-col justify-center"
            onClick={() => this.addAction("processor")}
          >
            <h2 className="text-3xl font-extrabold">PRO.</h2>
            {this.getActionValue("processor")}
          </button>
        </div>
        <div
          style={{
            backgroundSize: "100% 100%",
            width: width,
            height: height,
            position: "relative",
          }}
          onTouchStart={(event) => {
            //change color
          }}
          onTouchEnd={(event) => {
            //change color
          }}
          onClick={(event) => this.addSide(this.getSide(event))}
        >
          <canvas ref={this.canvasRef} width={width} height={height} />
        </div>

        <div className="flex flex-row justify-center mb-4">
          <button
            className="buttonS mr-2 items-center flex flex-col justify-center relative"
            onClick={() => this.addAction("coralFeeder")}
          >
            <img src={coralSVG} width={80} alt="Coral Icon" />
            <span className="absolute inset-0 flex items-center justify-center text-2xl text-black font-bold">
              {this.getActionValue("coralFeeder")}
            </span>
          </button>
          <button
            className="buttonS ml-4 mr-2 items-center flex flex-col justify-center relative"
            onClick={() => this.addAction("coralGround")}
          >
            <img src={coralSVG} width={80} alt="Coral Icon" />
            <span className="absolute inset-0 flex items-center justify-center text-2xl text-black font-bold">
              {this.getActionValue("coralGround")}
            </span>
          </button>
        </div>
        <div>
          <button
            onClick={() => this.undo()}
            className="bg-purple-700 w-48 h-20 text-white py-2 px-4 rounded"
          >
            Undo
          </button>
        </div>
      </div>
    );
  }
}
export default ReefPickInput;
