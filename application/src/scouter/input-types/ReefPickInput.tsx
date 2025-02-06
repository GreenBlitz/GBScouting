import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";
import { Point } from "chart.js";
import "../../components/reefScore.css";
import coralSVG from "../../assets/low-coral.svg";
import algeaSVG from "../../assets/low-algea.svg";
import { Navigate } from "react-router-dom";
import { Color } from "../../utils/Color";
import { getDistance } from "../../utils/Utils";

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
  { center: { x: 90, y: 200 }, reefSide: { side: "left", proximity: "close" } },
  {
    center: { x: 50, y: 130 },
    reefSide: { side: "left", proximity: "middle" },
  },
  { center: { x: 90, y: 65 }, reefSide: { side: "left", proximity: "far" } },
  { center: { x: 170, y: 65 }, reefSide: { side: "right", proximity: "far" } },

  {
    center: { x: 210, y: 130 },
    reefSide: { side: "right", proximity: "middle" },
  },
  {
    center: { x: 170, y: 200 },
    reefSide: { side: "right", proximity: "close" },
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

class ReefPickInput extends ScouterInput<
  PickedObjective[],
  {
    navigationDestination: string;
    triangleColor: Color;
    backgroundColor: Color;
  },
  {
    objectives: PickedObjective[];
    redirectToNext: boolean;
    coloredTriangleIndex?: number;
  }
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
  ):
    | {
        objectives: PickedObjective[];
        redirectToNext: boolean;
        coloredTriangleIndex?: number;
      }
    | undefined {
    return {
      objectives: this.getValue(),
      redirectToNext: false,
      coloredTriangleIndex: undefined,
    };
  }

  constructor(
    props: InputProps<PickedObjective[]> & {
      navigationDestination: string;
      triangleColor: Color;
      backgroundColor: Color;
    }
  ) {
    super(props);
    this.canvasRef = React.createRef<HTMLCanvasElement>();
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
      const stepSize = 30;

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

  addSide(side: ReefSide) {
    this.state.objectives.push(side);
    this.setState({
      objectives: this.state.objectives,
      redirectToNext: true,
    });
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
    const minDistance = triangleMiddles.reduce(
      (accumulator, value) =>
        Math.min(accumulator, getDistance(clickedPoint, value.center)),
      width + height
    );
    return triangleMiddles.findIndex(
      (value) =>
        Math.abs(getDistance(clickedPoint, value.center) - minDistance) < 1
    );
  }

  renderInput(): React.ReactNode {
    if (this.state.redirectToNext) {
      return <Navigate to={this.props.navigationDestination} />;
    }

    const coralFeederButton = (
      <button
        className="buttonS mr-2 items-center flex flex-col justify-center relative"
        onClick={() => this.addAction("coralFeeder")}
      >
        <h2 className="absolute mb-16 text-2xl font-extrabold">Feeder</h2>
        <img className="mt-2" src={coralSVG} width={80} alt="Coral Icon" />
        <span className="absolute mt-2 inset-0 flex items-center justify-center text-2xl text-black font-bold">
          {this.getActionValue("coralFeeder")}
        </span>
      </button>
    );

    const coralGroundButton = (
      <button
        className="buttonS ml-4 mr-2 items-center flex flex-col justify-center relative"
        onClick={() => this.addAction("coralGround")}
      >
        <h2 className="absolute mb-16 text-2xl font-extrabold">Ground</h2>
        <img className="mt-2" src={coralSVG} width={80} alt="Coral Icon" />
        <span className="absolute mt-2 inset-0 flex items-center justify-center text-2xl text-black font-bold">
          {this.getActionValue("coralGround")}
        </span>
      </button>
    );

    const algeaGroundButton = (
      <button
        className="buttonS ml-4 mr-2 items-center flex flex-col justify-center relative"
        onClick={() => this.addAction("algeaGround")}
      >
        <h2 className="absolute mb-16 text-2xl font-extrabold">Ground</h2>
        <img className="mt-6" src={algeaSVG} width={60} alt="Algea Icon" />
        <span className="absolute mt-6 inset-0 flex items-center justify-center text-2xl text-black font-bold">
          {this.getActionValue("algeaGround")}
        </span>
      </button>
    );

    const reef = (
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

    return (
      <div className="flex items-center justify-center flex-col">
        <div className="flex flex-row justify-center">
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
        </div>
        <button
          className="buttonS ml-4 mr-2 items-center flex flex-col justify-center mb-4"
          onClick={() => this.addAction("processor")}
        >
          <h2 className="text-3xl font-extrabold">PRO.</h2>
          {this.getActionValue("processor")}
        </button>

        {reef}

        <div className="flex flex-row justify-center">
          {coralFeederButton}
          {coralGroundButton}
        </div>
        {algeaGroundButton}
        <div>
          <button
            onClick={() => this.undo()}
            className="bg-[#596c86] w-48 h-16 text-white py-2 px-4 rounded mt-4"
          >
            Undo
          </button>
        </div>
      </div>
    );
  }
}
export default ReefPickInput;
