import { Point } from "chart.js";
import React from "react";
import { useEffect, useRef } from "react";

const DefaultSize = { width: 432, height: 192 };

interface FieldData {
  data: string;
  successfulness: boolean;
}

export interface FieldPoint extends Point, FieldData {}
export interface FieldLine extends FieldData {
  startPoint: Point;
  endPoint: Point;
}

export type FieldObject = FieldLine | FieldPoint;
interface MapChartProps {
  width?: number;
  height?: number;
  imagePath: string;
  fieldObjects: FieldObject[];
}

const colorMap: Record<string, string> = {
  "Speaker Score": "green",
  "Speaker Miss": "red",
  Pass: "purple",
  Note: "#947325",
  StartPass: "#155237",
};
const pointRadius = 5;
const MapChart: React.FC<MapChartProps> = ({
  width: mapWidth,
  height: mapHeight,
  imagePath,
  fieldObjects,
}) => {
  const [width, height] = [
    mapWidth || DefaultSize.width,
    mapHeight || DefaultSize.height,
  ];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context = canvasRef.current ? canvasRef.current.getContext("2d") : null;
  function drawPoints() {
    if (!context) {
      return;
    }
    context.clearRect(0, 0, width, height);

    for (let fieldObject of fieldObjects) {
      const isPassing = (fieldObject as FieldPoint).x === undefined;
      if (isPassing) {
        const { startPoint, endPoint } = fieldObject as FieldLine;
        context.strokeStyle = colorMap["Pass"];
        context.beginPath();
        context.moveTo(startPoint.x, startPoint.y);
        context.lineTo(endPoint.x, endPoint.y);
        context.lineWidth = pointRadius;
        context.stroke();
        context.fillStyle = colorMap["StartPass"];
        context.beginPath();
        context.arc(startPoint.x, startPoint.y, pointRadius, 0, 2 * Math.PI);
        context.fill();
        fieldObject = {
          x: endPoint.x,
          y: endPoint.y,
          data: "Note",
          successfulness: fieldObject.successfulness,
        };
      }
      fieldObject = fieldObject as FieldPoint;
      context.fillStyle = colorMap[fieldObject.data];
      if (fieldObject.data === "Speaker") {
        context.fillStyle =
          colorMap[`Speaker ${fieldObject.successfulness ? "Score" : "Miss"}`];
      }
      context.beginPath();
      context.arc(fieldObject.x, fieldObject.y, pointRadius, 0, 2 * Math.PI);
      context.fill();
    }
  }

  useEffect(drawPoints, [fieldObjects]);
  return (
    <div
      style={{
        backgroundImage: 'url("' + imagePath + '")',
        backgroundSize: "100% 100%",
        width: width,
        height: height,
      }}
    >
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};

export default MapChart;
