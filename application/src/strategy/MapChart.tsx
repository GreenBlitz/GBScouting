import { Point } from "chart.js";
import { useEffect, useRef } from "react";

export interface DataPoint extends Point {
  data: string;
  successfulness: number;
}
export type PassingPoint = [DataPoint, Point];
interface MapChartProps {
  width: number;
  height: number;
  imagePath: string;
  dataPoints: (DataPoint | PassingPoint)[];
}

const colorMap: Record<string, string> = {
  Speaker: "yellow",
  Pass: "purple",
  Note: "red",
  StartPass: "green",
};
const pointRadius = 5;
const MapChart: React.FC<MapChartProps> = ({
  width,
  height,
  imagePath,
  dataPoints,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context = canvasRef.current ? canvasRef.current.getContext("2d") : null;
  function drawPoints() {
    if (!context) {
      return;
    }
    context.clearRect(0, 0, width, height);

    for (let point of dataPoints) {
      const isPassing = (point as DataPoint).x === undefined;
      if (isPassing) {
        const [startPoint, endPoint] = point as PassingPoint;
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
        point = {
          x: endPoint.x,
          y: endPoint.y,
          data: "Note",
          successfulness: startPoint.successfulness,
        };
      }
      point = point as DataPoint;
      context.fillStyle = colorMap[point.data];
      context.beginPath();
      context.arc(point.x, point.y, pointRadius, 0, 2 * Math.PI);
      context.fill();
    }
  }

  useEffect(drawPoints, [dataPoints]);
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
