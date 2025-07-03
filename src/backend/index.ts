import express from "express";
import ViteExpress from "vite-express";
import { startConstantlyUpdatingISA } from "./db/ISA.js";
import team from "./routes/Team.js";

const app = express();

ViteExpress.listen(app, 5173, () =>
  console.log("Server on the sploopy doop http://localhost:5173")
);

startConstantlyUpdatingISA();

app.use("/api/team", team);
