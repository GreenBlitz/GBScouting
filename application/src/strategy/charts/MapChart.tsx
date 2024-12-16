import { Point } from "chart.js";
import React from "react";
import { useEffect, useRef } from "react";
import {
  FieldLine,
  FieldObject,
  FieldPoint,
  MapButton,
} from "../../scouter/inputtypes/MapInput";
import { Color } from "../../utils/Color";

const DefaultSize = { width: 432, height: 192 };

interface MapChartProps {
  width?: number;
  height?: number;
  imagePath: string;
  fieldObjects: FieldObject[];
}

const linePointsColors = { start: "#155237", end: "#947325" };

const possibleMapObjects: MapButton[] = [
  {
    name: "Speaker",
    successColor: "green",
    unsuccessColor: "red",
    isLine: false,
  },
  {
    name: "Pass",
    successColor: "purple",
    unsuccessColor: "purple",
    isLine: true,
  },
];

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

    const drawPoint = (point: Point, color: Color) => {
      context.fillStyle = color.toString();
      context.beginPath();
      context.arc(point.x, point.y, pointRadius, 0, 2 * Math.PI);
      context.fill();
    };

    context.clearRect(0, 0, this.props.width, this.props.height);

    for (let point of fieldObjects) {
      const isLine = (point as FieldPoint).x === undefined;
      const color = point.successfulness
        ? point.pressedButton.successColor
        : point.pressedButton.unsuccessColor;
      if (isLine) {
        const { startPoint, endPoint } = point as FieldLine;
        context.strokeStyle = color.toString();
        context.beginPath();
        context.moveTo(startPoint.x, startPoint.y);
        context.lineTo(endPoint.x, endPoint.y);
        context.lineWidth = pointRadius;
        context.stroke();
        drawPoint(startPoint, linePointsColors.start);
        drawPoint(endPoint, linePointsColors.end);
      } else {
        drawPoint(point as FieldPoint, color);
      }
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
