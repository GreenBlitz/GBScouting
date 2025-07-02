import express from "express";
import ViteExpress from "vite-express";
import { startConstantlyUpdatingISA } from "./ISA.js";
import team from "./Team.js";

const app = express();

ViteExpress.listen(app, 5173, () =>
  console.log("Server on the sploopy doop http://localhost:5173")
);

startConstantlyUpdatingISA();

app.use("/api/team", team);
