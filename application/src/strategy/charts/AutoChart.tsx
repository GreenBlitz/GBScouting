import React, { useEffect, useRef } from "react";
import { Auto } from "../../utils/SeasonUI";
import { Point } from "chart.js";

interface AutoProps {
  auto: Auto;
}

const coralPositions = [{ x: 200, y: 300 }];
const algeaPositions = [];

const coralRadius = 10;
const textSize = 1;

const width = 400;
const height = 200;

const AutoChart: React.FC<AutoProps> = ({ auto }) => {
  const imagePath = "./src/assets/blue-auto-map.png";

  const canvasRef = useRef<HTMLCanvasElement>(null);

  function drawCoral(position: Point, context: CanvasRenderingContext2D) {
    context.strokeStyle = "white";
    context.lineWidth = 4;
    context.beginPath();
    context.arc(position.x, position.y, coralRadius, 0, 2 * Math.PI);
    context.stroke();
  }

  function drawAlgea(position: Point, context: CanvasRenderingContext2D) {
    context.strokeStyle = "green";
    context.lineWidth = 4;
    context.beginPath();
    context.arc(position.x, position.y, coralRadius, 0, 2 * Math.PI);
    context.stroke();
  }

  function drawAll() {
    if (!canvasRef.current) {
      return;
    }
    const context = canvasRef.current.getContext("2d");
    if (!context) {
      return;
    }
    context.clearRect(0, 0, width, height);
    coralPositions.forEach((position) => drawCoral(position, context));
    algeaPositions.forEach((position) => drawAlgea(position, context));
  }

  useEffect(() => drawAll(), [drawAll, auto]);
  return (
    <div
      style={{
        backgroundImage: 'url("' + imagePath + '")',
        width: 300,
        height: 400,
      }}
    >
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};

export default AutoChart;
