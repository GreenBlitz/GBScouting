import { useEffect, useRef, useState } from "react";
import { Point } from "chart.js";
import React from "react";
import CounterQuery from "./CounterQuery";
import { queryFolder } from "../../utils/FolderStorage";

import {
  FieldLine,
  FieldObject,
  FieldPoint,
} from "../../strategy/charts/MapChart.tsx";
import Queries from "../Queries.ts";
import ScouterQuery, { QueryProps } from "../ScouterQuery.tsx";
interface MapQueryProps {
  width: number;
  height: number;
  imagePath: string;
}

const pointRadius: number = 5;
const succesfulnessOffset = [80, -60];

const crescendoButtons: Record<string, string> = {
  Speaker: "green",
  Pass: "purple",
};
const defaultButton = "Speaker";

interface MapStates {
  pressedButton: string;
  lastClickedPoint?: Point;
  passingPoint?: FieldPoint;
}

class MapQuery extends ScouterQuery<FieldObject[], MapQueryProps, MapStates> {
  private readonly canvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef<HTMLCanvasElement>();
  }

  instantiate(): React.JSX.Element {
    return <MapQuery {...this.props} />;
  }
  getStartingState(
    props: QueryProps<FieldObject[]> & MapQueryProps
  ): MapStates | undefined {
    return { pressedButton: defaultButton };
  }

  renderInput(): React.ReactNode {
    const side = Queries.GameSide.storage.get() || "Blue";

    const context = this.canvasRef.current
      ? this.canvasRef.current.getContext("2d")
      : null;

    const isButtonPressed = () => {
      return this.state.pressedButton !== "";
    };

    const addObject = (object: FieldObject) => {
      const previousPoints = this.storage.get() || [];
      previousPoints.push(object);
      this.storage.set(previousPoints);

      drawObjects();
    };

    const addPoint = (point: Point, successfulness: boolean) => {
      if (!isButtonPressed()) {
        return;
      }

      const clickedPoint: FieldPoint = {
        x: point.x,
        y: point.y,
        data: this.state.pressedButton,
        successfulness: successfulness,
      };
      this.setState({ lastClickedPoint: undefined });
      if (this.state.pressedButton === "Pass" && successfulness) {
        this.setState({ lastClickedPoint: clickedPoint });
        return;
      }
      addObject(clickedPoint);
    };

    const removeLastObject = () => {
      const previousObjects = this.storage.get() || [];
      previousObjects.pop();
      this.storage.set(previousObjects);

      drawObjects();
    };

    const drawObjects = () => {
      if (!context) {
        return;
      }
      context.clearRect(0, 0, this.props.width, this.props.height);

      for (let point of this.storage.get() || []) {
        const isLine = (point as FieldPoint).x === undefined;
        if (isLine) {
          const { startPoint, endPoint } = point as FieldLine;
          context.strokeStyle = crescendoButtons["Pass"];
          context.beginPath();
          context.moveTo(startPoint.x, startPoint.y);
          context.lineTo(endPoint.x, endPoint.y);
          context.lineWidth = pointRadius;
          context.stroke();
        } else {
          point = point as FieldPoint;
          if (point.data === "Speaker" && !point.successfulness) {
            context.fillStyle = "red";
          } else {
            context.fillStyle = crescendoButtons[point.data];
          }
          context.beginPath();
          context.arc(point.x, point.y, pointRadius, 0, 2 * Math.PI);
          context.fill();
        }
      }
    };

    const handleClick = (
      event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
    ) => {
      if (!isButtonPressed()) {
        return;
      }

      const clickedPoint = {
        x: event.pageX - event.currentTarget.offsetLeft,
        y: event.pageY - event.currentTarget.offsetTop,
      };

      if (this.state.passingPoint) {
        const fieldLine: FieldLine = {
          data: this.state.passingPoint.data,
          successfulness: this.state.passingPoint.successfulness,
          startPoint: this.state.passingPoint,
          endPoint: clickedPoint,
        };
        addObject(fieldLine);
        this.setState({
          passingPoint: undefined,
          pressedButton: defaultButton,
        });
        return;
      }
      this.setState({ lastClickedPoint: undefined });
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
            {Object.entries(crescendoButtons).map((option, index) => {
              const buttonName = option[0];
              if (buttonName === this.state.pressedButton) {
                return (
                  <React.Fragment key={index}>
                    <input
                      type="radio"
                      name={name + "-buttons"}
                      id={buttonName}
                      value={buttonName}
                      onChange={() =>
                        this.setState({ pressedButton: buttonName })
                      }
                      defaultChecked
                      className="cool-radio-input"
                    />
                    <label htmlFor={buttonName}>{buttonName}</label>
                  </React.Fragment>
                );
              }
              return (
                <React.Fragment key={index}>
                  <input
                    type="radio"
                    name={name + "-buttons"}
                    id={buttonName}
                    value={buttonName}
                    onChange={() =>
                      this.setState({ pressedButton: buttonName })
                    }
                    className="cool-radio-input"
                  />
                  <label htmlFor={buttonName}>{buttonName}</label>
                </React.Fragment>
              );
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
        {Queries.AmpScore.instantiate()}
        <br />
        {Queries.AmpMiss.instantiate()}
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
                offsetLeft -
                60
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
          {side === "Blue" ? (
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
          <input
            type="hidden"
            id={this.props.name}
            name={this.props.name}
            value={JSON.stringify(this.storage.get() || [])}
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
  getInitialValue(
    props: QueryProps<FieldObject[]> & MapQueryProps
  ): FieldObject[] {
    return [];
  }
}
export default MapQuery;
