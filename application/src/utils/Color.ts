import { all as htmlColorNames } from "html-colors";

const colorNames = htmlColorNames();

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type NAME = keyof typeof colorNames;

export function randomColor(): Color {
  const random = Math.random();
  const hex = `#${Math.floor(random * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
  return hex as Color;
}

export type Color = RGB | RGBA | HEX | NAME;
