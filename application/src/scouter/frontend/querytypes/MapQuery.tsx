import { useEffect, useRef, useState } from "react";
import { Point } from "../../../Utils";
import React from "react";
import { localStorageTabName } from "../ScouterQuery";
import CounterQuery from "./CounterQuery";
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
const succesfulnessOffset = [20, -60];

const crescendoButtons = {
  Speaker: "yellow",
  Pass: "purple",
};

const MapQuery: React.FC<MapQueryProps> = ({
  name,
  width,
  height,
  imagePath,
  side,
}) => {
  const localStorageKey = localStorageTabName + name + "/Points";
  const [dataPoints, setDataPoints] = useState<(DataPoint | PassingPoint)[]>(
    JSON.parse(localStorage.getItem(localStorageKey) || "[]")
  );
  const [pressedButton, setPressedButton] = useState<string>("");
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
    if (pressedButton === "Pass") {
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
        context.fillStyle = crescendoButtons[point.data];
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
      return;
    }
    setLastClickedPoint(clickedPoint);
  }

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(dataPoints));
    drawPoints();
  }, [dataPoints, addPoint]);

  const buttons = (
    <div className="map-buttons">
      {passingPoint ? (
        <>
          Set Passing Destination
          <br />
          <button type="button" onClick={() => setPassingPoint(undefined)}>
            Undo Pass
          </button>
        </>
      ) : (
        <div>
          {Object.entries(crescendoButtons).map((option, index) => {
            const buttonName = option[0];
            return (
              <React.Fragment key={index}>
                <input
                  type="radio"
                  name={name + "-buttons"}
                  id={buttonName}
                  value={buttonName}
                  onChange={() => setPressedButton(buttonName)}
                />
                <label htmlFor={buttonName}>{buttonName}</label>
              </React.Fragment>
            );
          })}
          <br />
          <button type="button" onClick={removeLastPoint}>
            Undo
          </button>
        </div>
      )}

      <div className={side === "blue" ? "map-amp-left" : "map-amp-right"}>
        <h2>AMP</h2>
        <br />
        <CounterQuery name={name + "/Amp/Hit"} color="#12a119" />
        <h3> HIT</h3>
        <br />
        <CounterQuery name={name + "/Amp/Miss"} color="#8f0a0e" />
        <h3> MISS</h3>
      </div>
    </div>
  );

  const successfulnessButtons = lastClickedPoint && (
    <div
      className="succesfulness"
      style={{
        left: canvasRef.current
          ? canvasRef.current.offsetLeft +
            lastClickedPoint.x +
            succesfulnessOffset[0]
          : 0,
        top: canvasRef.current
          ? canvasRef.current.offsetTop +
            lastClickedPoint.y +
            succesfulnessOffset[1]
          : 0,
      }}
    >
      <button type="button" onClick={() => addPoint(lastClickedPoint, true)}>
        Successful
      </button>
      <button type="button" onClick={() => addPoint(lastClickedPoint, false)}>
        Unsuccessful
      </button>
      <button type="button" onClick={() => setLastClickedPoint(undefined)}>
        Remove
      </button>
    </div>
  );

  return (
    <>
      <br />
      {buttons}
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
      {successfulnessButtons}

      <br />
    </>
  );
};
export default MapQuery;
