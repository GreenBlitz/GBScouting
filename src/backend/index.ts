import express from "express";
import ViteExpress from "vite-express";
import team from "./routes/Team.js";
import { startConstantlyUpdating } from "./db/Updates.js";

const app = express();

ViteExpress.listen(app, 5173, () =>
  console.log("Server on the sploopy doop http://localhost:5173")
);

startConstantlyUpdating();

app.use("/api/team", team);
