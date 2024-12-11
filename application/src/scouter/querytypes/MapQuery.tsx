import { useEffect, useRef, useState } from "react";
import { Point } from "chart.js";
import React from "react";
import CounterQuery from "./CounterQuery";
import {  queryFolder } from "../../utils/FolderStorage";

import {
  FieldLine,
  FieldObject,
  FieldPoint,
} from "../../strategy/charts/MapChart.tsx";
import Queries from "../Queries.ts";
interface MapQueryProps {
  name: string;
  side: "Blue" | "Red";
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

const MapQuery: React.FC<MapQueryProps> = ({
  name,
  width,
  height,
  imagePath,
  side,
}) => {
  const mapFolder = queryFolder.with(name + "/");
  const [fieldObjects, setFieldObjects] = useState<FieldObject[]>(
    JSON.parse(mapFolder.getItem("Points") || "[]")
  );

  const [pressedButton, setPressedButton] = useState<string>(defaultButton);
  const [lastClickedPoint, setLastClickedPoint] = useState<Point>();

  const [passingPoint, setFieldLine] = useState<FieldPoint>();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context = canvasRef.current ? canvasRef.current.getContext("2d") : null;

  function isButtonPressed(): boolean {
    return pressedButton !== "";
  }

  function addObjects(point: Point, successfulness: boolean) {
    if (!isButtonPressed()) {
      return;
    }

    const clickedPoint: FieldPoint = {
      x: point.x,
      y: point.y,
      data: pressedButton,
      successfulness: successfulness,
    };
    setLastClickedPoint(undefined);
    if (pressedButton === "Pass" && successfulness) {
      setFieldLine(clickedPoint);
      return;
    }
    setFieldObjects((prev) => [...prev, clickedPoint]);
  }

  function removeLastObject() {
    fieldObjects.pop();
    setFieldObjects((prev) => {
      prev = fieldObjects;
      return [...prev];
    });
  }

  function drawObjects() {
    if (!context) {
      return;
    }
    context.clearRect(0, 0, width, height);

    for (let point of fieldObjects) {
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
  }

  function handleClick(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (!isButtonPressed()) {
      return;
    }

    const clickedPoint = {
      x: event.pageX - event.currentTarget.offsetLeft,
      y: event.pageY - event.currentTarget.offsetTop,
    };

    if (passingPoint) {
      const fieldLine: FieldLine = {
        data: passingPoint.data,
        successfulness: passingPoint.successfulness,
        startPoint: passingPoint,
        endPoint: clickedPoint,
      };
      setFieldObjects((prev) => [...prev, fieldLine]);
      setFieldLine(undefined);
      setPressedButton(defaultButton);

      return;
    }
    setLastClickedPoint(clickedPoint);
  }

  useEffect(() => {
    mapFolder.setItem("Points", JSON.stringify(fieldObjects));
    drawObjects();
  }, [fieldObjects, addObjects]);

  const dataOptions = (
    <div className={"map-options"}>
      <br />
      <br />
      {passingPoint ? (
        <div>
          Set Passing Destination
          <br />
          <button type="button" onClick={() => setFieldLine(undefined)}>
            Undo Pass
          </button>
        </div>
      ) : (
        <div className="cool-radio">
          {Object.entries(crescendoButtons).map((option, index) => {
            const buttonName = option[0];
            if (buttonName === pressedButton) {
              return (
                <React.Fragment key={index}>
                  <input
                    type="radio"
                    name={name + "-buttons"}
                    id={buttonName}
                    value={buttonName}
                    onChange={() => setPressedButton(buttonName)}
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
                  onChange={() => setPressedButton(buttonName)}
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
      {Queries.AmpScore.render()}
      <br />
      {Queries.AmpMiss.render()}
    </div>
  );

  function getSuccesfulness(offsetLeft: number, offsetTop: number) {
    if (!lastClickedPoint) {
      return <></>;
    }
    return (
      <div
        className="succesfulness"
        style={{
          left: canvasRef.current
            ? canvasRef.current.offsetLeft +
              lastClickedPoint.x +
              offsetLeft -
              60
            : 0,
          top: canvasRef.current
            ? canvasRef.current.offsetTop + lastClickedPoint.y + offsetTop
            : 0,
        }}
      >
        <button
          type="button"
          onClick={() => addObjects(lastClickedPoint, true)}
        >
          ✅Score
        </button>
        <button
          type="button"
          onClick={() => addObjects(lastClickedPoint, false)}
        >
          ❌Miss
        </button>
        <button type="button" onClick={() => setLastClickedPoint(undefined)}>
          Cancel
        </button>
      </div>
    );
  }

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
          backgroundImage: 'url("' + imagePath + '")',
          backgroundSize: "100% 100%",
          width: width,
          height: height,
        }}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onClick={handleClick}
        />
        <input
          type="hidden"
          id={name}
          name={name}
          value={JSON.stringify(fieldObjects)}
        />
      </div>
      {canvasRef.current &&
      lastClickedPoint &&
      canvasRef.current.offsetLeft + lastClickedPoint.x < width
        ? getSuccesfulness(succesfulnessOffset[0], succesfulnessOffset[1])
        : getSuccesfulness(-succesfulnessOffset[0], succesfulnessOffset[1])}

      <br />
    </>
  );
};
export default MapQuery;
