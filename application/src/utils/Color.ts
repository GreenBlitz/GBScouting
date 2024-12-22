import { all as htmlColorNames } from "html-colors";

const colorNames = htmlColorNames();

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type NAME = keyof typeof colorNames ;

export type Color = RGB | RGBA | HEX | NAME;
