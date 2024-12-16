import { Point } from "chart.js";

export interface Note extends Point {
  color: "green" | "red" | "orange";
}

export const autoNotePositions: Point[] = [250, 200, 150, 100, 50].map(
  (height) => {
    return { x: 280, y: height };
  }
);
export const autoBlueNotePositions: Point[] = [150, 100, 50].map((height) => {
  return { x: 90, y: height };
});
