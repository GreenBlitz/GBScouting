import express from "express";
import ViteExpress from "vite-express";
import { getType } from "../types/Type.js";

const app = express();

ViteExpress.listen(app, 5173, () =>
  console.log("Server on the sploopy doop http://localhost:5173")
);

console.log(
  getType({
    x: 1,
    y: {
      g: ["Mr P"],
      h: true,
    },
    p: "crazy",
  })
);
