import React, { useEffect, useRef } from "react";
import { Auto } from "../../utils/SeasonUI";
import { Point } from "chart.js";
import { Sushi } from "../../scouter/input-types/auto-map/AutonomousMapInput";

interface AutoProps {
  auto: Auto;
}

const coralPositions = [
  { x: 200, y: 100 },
  { x: 200, y: 150 },
  { x: 200, y: 200 },
];
const algeaPositions = [
  { x: 150, y: 100 },
  { x: 150, y: 150 },
  { x: 150, y: 200 },
];

const coralRadius = 10;
const algeaRadius = 13;
const textSize = 1;

const width = 500;
const height = 300;

const AutoChart: React.FC<AutoProps> = ({ auto }) => {
  const imagePath = "/src/assets/blue-auto-map.png";

  const canvasRef = useRef<HTMLCanvasElement>(null);

  function drawCoral(position: Point, context: CanvasRenderingContext2D) {
    context.strokeStyle = "white";
    context.lineWidth = 4;
    context.beginPath();
    context.arc(position.x, position.y, coralRadius, 0, Math.PI * 2);
    context.stroke();
  }

  function drawAlgea(position: Point, context: CanvasRenderingContext2D) {
    context.fillStyle = "green";
    context.lineWidth = 4;
    context.beginPath();
    context.arc(position.x, position.y, algeaRadius, 0, 2 * Math.PI);
    context.fill();
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
    Object.values(auto.collected).forEach((sushi, index) => {
      const actualSushi: Sushi = sushi as Sushi;
      if (actualSushi.HasHarvested) {
        drawCoral(coralPositions[index], context);
      }
      if (actualSushi.HasSeeded) {
        drawAlgea(algeaPositions[index], context);
      }
    });
  }

  useEffect(() => drawAll(), [drawAll, auto]);
  return (
    <>
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
      <div className="flex flex-col items-center">
        <h2>Times Done: {auto.occurances}</h2>
      </div>
    </>
  );
};

export default AutoChart;
