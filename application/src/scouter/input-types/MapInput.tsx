import { Point } from "chart.js";
import React from "react";
import ScouterInputs from "../ScouterInputs.ts";
import ScouterInput, { InputProps } from "../ScouterInput.tsx";
import { Color } from "../../utils/Color.ts";

const pointRadius: number = 5;
const succesfulnessOffset = [20, -60];

interface MapInputProps {
  width: number;
  height: number;
  imagePath: string;
}

interface FieldData {
  pressedButton: MapButton;
  successfulness: boolean;
}

export interface FieldPoint extends Point, FieldData {}
export interface FieldLine extends FieldData {
  startPoint: Point;
  endPoint: Point;
}

export type FieldObject = FieldLine | FieldPoint;

export interface MapButton {
  name: string;
  successColor: Color;
  failColor: Color;
  isLine: boolean;
}

export const mapButtons: MapButton[] = [
  {
    name: "Speaker",
    successColor: "green",
    failColor: "red",
    isLine: false,
  },
  {
    name: "Pass",
    successColor: "purple",
    failColor: "purple",
    isLine: true,
  },
];

interface MapStates {
  pressedButton: MapButton;
  lastClickedPoint?: Point;
  passingPoint?: FieldPoint;
}

const defaultButton = mapButtons[0];

class MapInput extends ScouterInput<FieldObject[], MapInputProps, MapStates> {
  private readonly canvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef<HTMLCanvasElement>();
  }

  create(): React.JSX.Element {
    return <MapInput {...this.props} />;
  }
  getStartingState(
    props: InputProps<FieldObject[]> & MapInputProps
  ): MapStates | undefined {
    return { pressedButton: defaultButton };
  }

  renderInput(): React.ReactNode {
    const side = ScouterInputs.gameSide.getValue();

    const context = this.canvasRef.current
      ? this.canvasRef.current.getContext("2d")
      : null;

    const addObject = (object: FieldObject) => {
      const previousPoints = this.getValue();
      previousPoints.push(object);
      this.storage.set(previousPoints);

      drawObjects();
    };

    const addPoint = (point: Point, successfulness: boolean) => {
      const clickedPoint: FieldPoint = {
        x: point.x,
        y: point.y,
        pressedButton: this.state.pressedButton,
        successfulness: successfulness,
      };
      this.setState({ lastClickedPoint: undefined });
      if (this.state.pressedButton.isLine && successfulness) {
        this.setState({ passingPoint: clickedPoint });
      } else {
        addObject(clickedPoint);
      }
    };

    const removeLastObject = () => {
      const previousObjects = this.getValue();
      previousObjects.pop();
      this.storage.set(previousObjects);

      drawObjects();
    };

    const drawObjects = () => {
      if (!context) {
        return;
      }
      context.clearRect(0, 0, this.props.width, this.props.height);

      for (let point of this.getValue()) {
        const isLine = (point as FieldPoint).x === undefined;
        const color = point.successfulness
          ? point.pressedButton.successColor
          : point.pressedButton.failColor;
        if (isLine) {
          const { startPoint, endPoint } = point as FieldLine;
          context.strokeStyle = color.toString();
          context.beginPath();
          context.moveTo(startPoint.x, startPoint.y);
          context.lineTo(endPoint.x, endPoint.y);
          context.lineWidth = pointRadius;
          context.stroke();
        } else {
          point = point as FieldPoint;
          context.fillStyle = color.toString();
          context.beginPath();
          context.arc(point.x, point.y, pointRadius, 0, 2 * Math.PI);
          context.fill();
        }
      }
    };

    const handleClick = (
      event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
    ) => {
      const clickedPoint = {
        x: event.pageX - event.currentTarget.offsetLeft,
        y: event.pageY - event.currentTarget.offsetTop,
      };

      if (this.state.passingPoint) {
        const fieldLine: FieldLine = {
          pressedButton: this.state.passingPoint.pressedButton,
          successfulness: this.state.passingPoint.successfulness,
          startPoint: this.state.passingPoint,
          endPoint: clickedPoint,
        };
        addObject(fieldLine);
        this.setState({
          passingPoint: undefined,
          pressedButton: defaultButton,
        });
      } else {
        this.setState({ lastClickedPoint: clickedPoint });
      }
    };

    const dataOptions = (
      <div className={"map-options"}>
        <br />
        <br />
        {this.state.passingPoint ? (
          <div>
            Set Passing Destination
            <br />
            <button
              type="button"
              onClick={() => this.setState({ passingPoint: undefined })}
            >
              Undo Pass
            </button>
          </div>
        ) : (
          <div className="cool-radio">
            {mapButtons.map((button, buttonIndex) => {
              if (button === this.state.pressedButton) {
                return (
                  <React.Fragment key={buttonIndex}>
                    <input
                      type="radio"
                      name={name + "-buttons"}
                      id={button.name}
                      value={button.name}
                      onChange={() => this.setState({ pressedButton: button })}
                      defaultChecked
                      className="cool-radio-input"
                    />
                    <label htmlFor={button.name}>{button.name}</label>
                  </React.Fragment>
                );
              } else {
                return (
                  <React.Fragment key={buttonIndex}>
                    <input
                      type="radio"
                      name={name + "-buttons"}
                      id={button.name}
                      value={button.name}
                      onChange={() => this.setState({ pressedButton: button })}
                      className="cool-radio-input"
                    />
                    <label htmlFor={button.name}>{button.name}</label>
                  </React.Fragment>
                );
              }
            })}
            <br />
            <br />
            <button type="button" onClick={removeLastObject}>
              Undo
            </button>
          </div>
        )}
      </div>
    );

    const ampOptions = (
      <div className={"map-amp"}>
        <h2>AMP</h2>
        <br />
        <br />
      </div>
    );

    const getSuccesfulness = (offsetLeft: number, offsetTop: number) => {
      const lastClickedPoint = this.state.lastClickedPoint;

      if (!lastClickedPoint) {
        return <></>;
      }
      return (
        <div
          className="succesfulness"
          style={{
            left: this.canvasRef.current
              ? this.canvasRef.current.offsetLeft +
                lastClickedPoint.x +
                offsetLeft
              : 0,
            top: this.canvasRef.current
              ? this.canvasRef.current.offsetTop +
                lastClickedPoint.y +
                offsetTop
              : 0,
          }}
        >
          <button
            type="button"
            onClick={() => addPoint(lastClickedPoint, true)}
          >
            ✅Score
          </button>
          <button
            type="button"
            onClick={() => addPoint(lastClickedPoint, false)}
          >
            ❌Miss
          </button>
          <button
            type="button"
            onClick={() => this.setState({ lastClickedPoint: undefined })}
          >
            Cancel
          </button>
        </div>
      );
    };

    return (
      <>
        <div className="map-buttons">
          {side === ScouterInputs.gameSide.defaultValue() ? (
            <>
              {ampOptions}
              {dataOptions}
            </>
          ) : (
            <>
              {dataOptions}
              {ampOptions}
            </>
          )}
        </div>
        <div
          style={{
            backgroundImage: 'url("' + this.props.imagePath + '")',
            backgroundSize: "100% 100%",
            width: this.props.width,
            height: this.props.height,
          }}
        >
          <canvas
            ref={this.canvasRef}
            width={this.props.width}
            height={this.props.height}
            onClick={handleClick}
          />
        </div>
        {this.canvasRef.current &&
        this.state.lastClickedPoint &&
        this.canvasRef.current.offsetLeft + this.state.lastClickedPoint.x <
          this.props.width
          ? getSuccesfulness(succesfulnessOffset[0], succesfulnessOffset[1])
          : getSuccesfulness(-succesfulnessOffset[0], succesfulnessOffset[1])}

        <br />
      </>
    );
  }
  initialValue(): FieldObject[] {
    return [];
  }
}
export default MapInput;
