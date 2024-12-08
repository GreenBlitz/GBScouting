type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type NAME = string // pink, red, etc.. (im not going to go through every one)

export type Color = RGB | RGBA | HEX | NAME;
