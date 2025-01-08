import React, { useEffect, useRef } from "react";

interface LinearHistogramProps {
  width: number;
  height: number;
}

const boxThickness = 5;

const LinearHistogramChart: React.FC<LinearHistogramProps> = ({
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context = canvasRef.current ? canvasRef.current.getContext("2d") : null;
  const initializeBox = (context: CanvasRenderingContext2D) => {
    context.fillRect(0, 0, width, height);
    context.clearRect(
      boxThickness,
      boxThickness,
      width - boxThickness,
      height - boxThickness
    );
  };

  useEffect(() => {
    if (context) {
      initializeBox(context);
    }
  });
  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
};
