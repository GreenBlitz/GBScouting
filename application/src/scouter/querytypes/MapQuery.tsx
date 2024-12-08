import { useEffect, useRef, useState } from "react";
import { Point } from "chart.js";
import React from "react";
import CounterQuery from "./CounterQuery";
import { queryFolder } from "../../utils/FolderStorage";

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
const arrowSize: number = 10;
const succesfulnessOffset = [80, -60];

const crescendoButtons: Record<string, string> = {
  Speaker: "green",
  Pass: "#8b5cf6",
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

  const [showPassModal, setShowPassModal] = useState<boolean>(false);
  const [tempPassingLine, setTempPassingLine] = useState<{start: DataPoint, end: Point} | null>(null);

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
      if (!passingPoint) {
        setPassingPoint(clickedPoint);
      } else {
        // Store the passing line temporarily and show the success/miss modal
        setTempPassingLine({ start: passingPoint, end: point });
        setShowPassModal(true);
        setPassingPoint(undefined);
      }
      return;
    }
    
    setDataPoints((prev) => [...prev, clickedPoint]);
  }

  function handlePassResult(success: boolean) {
    if (tempPassingLine) {
      const passLine: PassingPoint = [
        { ...tempPassingLine.start, successfulness: success },
        tempPassingLine.end
      ];
      setDataPoints((prev) => [...prev, passLine]);
      setTempPassingLine(null);
    }
    setShowPassModal(false);
  }

  function removeLastPoint() {
    dataPoints.pop();
    setDataPoints((prev) => {
      prev = dataPoints;
      return [...prev];
    });
  }

  function drawArrow(fromx: number, fromy: number, tox: number, toy: number) {
    if (!context) return;

    const headlen = arrowSize;
    const dx = tox - fromx;
    const dy = toy - fromy;
    const angle = Math.atan2(dy, dx);

    // Draw the main line
    context.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.stroke();

    // Draw the arrow head
    context.beginPath();
    context.moveTo(tox, toy);
    context.lineTo(
      tox - headlen * Math.cos(angle - Math.PI / 6),
      toy - headlen * Math.sin(angle - Math.PI / 6)
    );
    context.moveTo(tox, toy);
    context.lineTo(
      tox - headlen * Math.cos(angle + Math.PI / 6),
      toy - headlen * Math.sin(angle + Math.PI / 6)
    );
    context.stroke();
  }

  function drawPoints() {
    if (!context) {
      return;
    }
    context.clearRect(0, 0, width, height);

    // Draw temporary pass line if in passing mode
    if (passingPoint && lastClickedPoint) {
      context.strokeStyle = crescendoButtons["Pass"];
      context.lineWidth = pointRadius;
      drawArrow(
        passingPoint.x,
        passingPoint.y,
        lastClickedPoint.x,
        lastClickedPoint.y
      );

      // Draw highlight around start point
      context.fillStyle = "rgba(139, 92, 246, 0.3)"; // Semi-transparent purple
      context.beginPath();
      context.arc(passingPoint.x, passingPoint.y, pointRadius * 2, 0, 2 * Math.PI);
      context.fill();
    }

    for (let point of dataPoints) {
      const isPassing = (point as DataPoint).x === undefined;
      if (isPassing) {
        const [startPoint, endPoint] = point as PassingPoint;
        context.strokeStyle = startPoint.successfulness ? crescendoButtons["Pass"] : "#ff1493"; // Purple for success, pink for miss
        context.lineWidth = pointRadius;
        drawArrow(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
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
      // Draw final pass line with arrow
      setTempPassingLine({ start: passingPoint, end: clickedPoint });
      setShowPassModal(true);
      setPassingPoint(undefined);
      return;
    }

    if (pressedButton === "Pass") {
      const newPassingPoint: DataPoint = {
        x: clickedPoint.x,
        y: clickedPoint.y,
        data: pressedButton,
        successfulness: true,
      };
      setPassingPoint(newPassingPoint);
      return;
    }

    setLastClickedPoint(clickedPoint);
  }

  useEffect(() => {
    mapFolder.setItem("Points", JSON.stringify(dataPoints));
    drawPoints();
  }, [dataPoints]);

  function getSuccesfulness(offsetLeft: number, offsetTop: number) {
    if (!lastClickedPoint) {
      return <></>;
    }
    return (
      <div
        className="succesfulness bg-gray-800/90 p-3 rounded-lg shadow-lg border border-gray-700 flex flex-col gap-2"
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
          onClick={() => addPoint(lastClickedPoint, true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          <span className="text-lg">✅</span>
          <span className="font-medium">Score</span>
        </button>
        <button 
          type="button" 
          onClick={() => addPoint(lastClickedPoint, false)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          <span className="text-lg">❌</span>
          <span className="font-medium">Miss</span>
        </button>
        <button 
          type="button" 
          onClick={() => setLastClickedPoint(undefined)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          <span className="font-medium">Cancel</span>
        </button>
      </div>
    );
  }

  const ampOptions = (
    <div className="map-amp flex flex-col items-center gap-6">
      <h2 className="text-2xl font-semibold">AMP</h2>
      <div className="flex flex-col gap-6 w-full items-center">
        <div>
          <div className="text-gray-300 mb-2 text-center">CRESCENDO/Amp/Score</div>
          <div className="flex justify-center">
            <CounterQuery name={name + "/Amp/Score"} color="#12a119" hideLabel={true} />
          </div>
        </div>
        <div>
          <div className="text-gray-300 mb-2 text-center">CRESCENDO/Amp/Miss</div>
          <div className="flex justify-center">
            <CounterQuery name={name + "/Amp/Miss"} color="#8f0a0e" hideLabel={true} />
          </div>
        </div>
      </div>
    </div>
  );

  const dataOptions = (
    <div className="map-options bg-gray-800 p-4 rounded-lg shadow-lg">
      {passingPoint ? (
        <div className="flex flex-col items-center gap-3">
          <div className="text-lg font-semibold text-purple-400">Drawing Pass Line</div>
          <div className="text-sm text-gray-400">Click on the field to set the pass destination</div>
          <button 
            type="button" 
            onClick={() => setPassingPoint(undefined)}
            className="px-4 py-2 mt-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Cancel Pass
          </button>
        </div>
      ) : (
        <div className="cool-radio flex flex-col gap-4">
          <div className="flex gap-4 justify-center">
            {Object.entries(crescendoButtons).map((option, index) => {
              const [buttonName, color] = option;
              const isSelected = buttonName === pressedButton;
              return (
                <label 
                  key={index}
                  className={`
                    relative flex items-center justify-center px-6 py-3 rounded-lg cursor-pointer
                    transition-all duration-200
                    ${isSelected ? 'ring-2 ring-offset-2 ring-offset-gray-800' : 'hover:bg-gray-700'}
                    ${buttonName === 'Speaker' ? 'bg-green-600 hover:bg-green-700 ring-green-500' : ''}
                    ${buttonName === 'Pass' ? 'bg-purple-600 hover:bg-purple-700 ring-purple-500' : ''}
                  `}
                >
                  <input
                    type="radio"
                    name={name + "-buttons"}
                    id={buttonName}
                    value={buttonName}
                    onChange={() => setPressedButton(buttonName)}
                    checked={isSelected}
                    className="sr-only"
                  />
                  <span className="text-white font-medium">{buttonName}</span>
                </label>
              );
            })}
          </div>
          <button 
            type="button" 
            onClick={removeLastPoint}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Undo Last Action
          </button>
        </div>
      )}
    </div>
  );

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
        {/* Pass Success/Miss Modal */}
        {showPassModal && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-dark-card p-4 rounded-lg shadow-lg border border-dark-border">
            <div className="flex gap-4">
              <button
                onClick={() => handlePassResult(true)}
                className="btn btn-primary flex items-center gap-2"
              >
                <span>Completed</span>
              </button>
              <button
                onClick={() => handlePassResult(false)}
                className="btn btn-secondary flex items-center gap-2"
              >
                <span>Missed</span>
              </button>
            </div>
          </div>
        )}
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
