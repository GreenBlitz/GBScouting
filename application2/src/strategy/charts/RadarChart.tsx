import React, { useRef, useEffect } from "react";

/// A class representing a single point on a 2D plane
class Point {
  constructor(public x: number, public y: number) {}

  /// The origin (0, 0)
  static ORIGIN = new Point(0, 0);

  /// Make a `Point` from polar coordinates (r, theta)
  static polar(r: number, theta: number): Point {
    return new Point(r * Math.cos(theta), r * Math.sin(theta));
  }

  /// Make a `Point` representing the centre of the given `canvas`
  static canvasCentre(canvas: HTMLCanvasElement): Point {
    return new Point(canvas.width, canvas.height).scale(1 / 2);
  }

  get xy(): [number, number] {
    return [this.x, this.y];
  }

  /// Add two points
  add(offset: Point): Point {
    return new Point(this.x + offset.x, this.y + offset.y);
  }

  /// Scale a point around another point.
  scale(scale: number, around: Point = Point.ORIGIN): Point {
    return new Point(
      (this.x - around.x) * scale + around.x,
      (this.y - around.y) * scale + around.y
    );
  }

  /// Returns the direction this point is in from the given point, along the x and y axes.
  directionFrom(
    point: Point,
    precision: number = 1
  ): [CanvasTextAlign, CanvasTextBaseline] {
    const dx = Math.round((this.x - point.x) / precision) * precision;
    const dy = Math.round((this.y - point.y) / precision) * precision;

    const align = dx > 0 ? "left" : dx == 0 ? "center" : "right";
    const baseline = dy > 0 ? "top" : dy == 0 ? "middle" : "bottom";

    return [align, baseline];
  }
}

/// Make an array with `length` `Point`s, each equally spaced on the circle defined by `centre` and `radius`.
function pointsOnCircle(
  centre: Point,
  radius: number,
  length: number
): Point[] {
  return [...Array(length).keys()].map((i) =>
    centre.add(Point.polar(radius, (i * Math.PI * 2) / length))
  );
}

/// Draw a polygon with the given `vertices` to the `context`.
function drawPolygon(context: CanvasRenderingContext2D, vertices: Point[]) {
  context.beginPath();

  const last = vertices[vertices.length - 1];
  context.moveTo(...last.xy);

  for (const point of vertices) {
    context.lineTo(...point.xy);
  }

  context.stroke();
}

export interface Statistic {
  name: string;
  maxValue: number;
}
export type Schema = Statistic[];
export type Datum = number;

export interface RadarInput {
  name: string;
  value: number;
  max: number;
}

export interface RadarComponentProps {
  inputs: RadarInput[];
  /// Width & height of the entire canvas element of a `RadarComponent`
  size: number;
  /// Number of smaller polygons drawn as ruler markings
  substeps: number;
}

export const RadarComponent: React.FC<RadarComponentProps> = ({
  inputs,
  size,
  substeps,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // TODO: better metric
  const polygonRadius = (size / 2) * 0.75;

  /// Places regularly-spaced labels around the component
  function drawLables(context: CanvasRenderingContext2D) {
    const centre = Point.canvasCentre(context.canvas);
    const vertices = pointsOnCircle(centre, polygonRadius + 10, inputs.length);

    context.beginPath();

    for (const i in inputs) {
      const text = inputs[i].name;

      [context.textAlign, context.textBaseline] = vertices[i].directionFrom(
        centre,
        10
      );

      context.fillText(text, ...vertices[i].xy);
    }

    context.closePath();
    context.fill();
    context.stroke();
  }

  /// Draw the entire radar chart
  function draw(context: CanvasRenderingContext2D) {
    const centre = Point.canvasCentre(context.canvas);
    const outerPolygon = pointsOnCircle(centre, polygonRadius, inputs.length);

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    // Evenly-spaced regular polygons
    context.lineWidth = 1.5;
    context.strokeStyle = "gray";
    for (let i = 1; i <= substeps; i++) {
      if (i == substeps) {
        // Stronger outer polygon
        context.lineWidth = 3;
        context.strokeStyle = "white";
      }
      drawPolygon(
        context,
        pointsOnCircle(centre, (polygonRadius * i) / substeps, inputs.length)
      );
    }

    // Lines to each vertex
    context.lineWidth = 0.5;
    context.strokeStyle = "gray";
    context.beginPath();
    for (const point of outerPolygon) {
      context.moveTo(...centre.xy);
      context.lineTo(...point.xy);
      context.stroke();
    }

    // Data labels
    context.lineWidth = 3;
    context.fillStyle = "white";
    context.font = "12pt Arial";
    drawLables(context);

    // Values polygon
    const statVertices = pointsOnCircle(
      centre,
      polygonRadius,
      inputs.length
    ).map((p, i) => p.scale(inputs[i].value / inputs[i].max, centre));

    context.strokeStyle = "white";
    context.fillStyle = "rgb(96, 190, 235, 0.5)";
    context.lineWidth = 3;
    drawPolygon(context, statVertices);
    context.fill();
  }

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d")!;

    draw(context);
  });

  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  );
};
export default RadarComponent;
