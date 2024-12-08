import { useEffect, useRef, useState } from "react";
import { Point } from "chart.js";
import React from "react";
import CounterQuery from "./CounterQuery";
import { Queries, queryFolder } from "../../utils/FolderStorage";
interface MapQueryProps {
  name: string;
  side: "blue" | "red";
  width: number;
  height: number;
  imagePath: string;
}

interface DataPoint extends Point {
  data: string;
  successfulness: boolean;
}

type PassingPoint = [DataPoint, Point];

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
  const [dataPoints, setDataPoints] = useState<(DataPoint | PassingPoint)[]>(
    JSON.parse(mapFolder.getItem("Points") || "[]")
  );

  const [pressedButton, setPressedButton] = useState<string>(defaultButton);
  const [lastClickedPoint, setLastClickedPoint] = useState<Point>();

  const [passingPoint, setPassingPoint] = useState<DataPoint>();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context = canvasRef.current ? canvasRef.current.getContext("2d") : null;

  function isButtonPressed(): boolean {
    return pressedButton !== "";
  }

  function addPoint(point: Point, successfulness: boolean) {
    if (!isButtonPressed()) {
      return;
    }

    const clickedPoint: DataPoint = {
      x: point.x,
      y: point.y,
      data: pressedButton,
      successfulness: successfulness,
    };
    setLastClickedPoint(undefined);
    if (pressedButton === "Pass" && successfulness) {
      setPassingPoint(clickedPoint);
      return;
    }
    setDataPoints((prev) => [...prev, clickedPoint]);
  }

  function removeLastPoint() {
    dataPoints.pop();
    setDataPoints((prev) => {
      prev = dataPoints;
      return [...prev];
    });
  }

  function drawPoints() {
    if (!context) {
      return;
    }
    context.clearRect(0, 0, width, height);

    for (let point of dataPoints) {
      const isPassing = (point as DataPoint).x === undefined;
      if (isPassing) {
        const [startPoint, endPoint] = point as PassingPoint;
        context.strokeStyle = crescendoButtons["Pass"];
        context.beginPath();
        context.moveTo(startPoint.x, startPoint.y);
        context.lineTo(endPoint.x, endPoint.y);
        context.lineWidth = pointRadius;
        context.stroke();
      } else {
        point = point as DataPoint;
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
      setDataPoints((prev) => [...prev, [passingPoint, clickedPoint]]);
      setPassingPoint(undefined);
      setPressedButton(defaultButton);

      return;
    }
    setLastClickedPoint(clickedPoint);
  }

  useEffect(() => {
    mapFolder.setItem("Points", JSON.stringify(dataPoints));
    drawPoints();
  }, [dataPoints, addPoint]);

  const dataOptions = (
    <div className={"map-options"}>
      <br />
      <br />
      {passingPoint ? (
        <div>
          Set Passing Destination
          <br />
          <button type="button" onClick={() => setPassingPoint(undefined)}>
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
          <button type="button" onClick={removeLastPoint}>
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
      <CounterQuery storage={Queries.AmpScore} color="#12a119" />
      <br />
      <CounterQuery storage={Queries.AmpMiss} color="#8f0a0e" />
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
        <button type="button" onClick={() => addPoint(lastClickedPoint, true)}>
          ✅Score
        </button>
        <button type="button" onClick={() => addPoint(lastClickedPoint, false)}>
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
        {side === "blue" ? (
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
          value={JSON.stringify(dataPoints)}
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
