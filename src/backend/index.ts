import express from "express";
import ViteExpress from "vite-express";
import isa from "./ISA.js";

const app = express();

ViteExpress.listen(app, 5173, () =>
  console.log("Server on the sploopy doop http://localhost:5173")
);

app.use("/api/isa", isa);

