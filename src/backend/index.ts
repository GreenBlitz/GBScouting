import express from "express";
import ViteExpress from "vite-express";

const app = express();

ViteExpress.listen(app, 5173, () =>
  console.log("Server on the sploopy doop http://localhost:5173")
);
