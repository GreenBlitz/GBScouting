import express, { Request, Response } from "express";
import { Db, MongoClient } from "mongodb";
import ViteExpress from "vite-express";
import fs from "fs";
import path from "path";
import https from "https";
import cors from "cors";
import * as matches from "./matches.js";
import * as tba from "./tba.js";
import * as notes from "./notes.js";

const app = express();
const hostname = "0.0.0.0";
const port = 4590;

const dirName = process.env.PRODUCTION ? "/app" : "";

// SSL options for HTTPS
let sslOptions;
try {
  sslOptions = {
    key: fs.readFileSync(path.resolve(dirName, "ssl-key.pem")), // Path to the key file
    cert: fs.readFileSync(path.resolve(dirName, "ssl.pem")), // Path to the certificate file
  };
} catch (exception) {
  console.log(exception);
  sslOptions = { key: "", cert: "" };
}

app.use(express.json());
app.use(cors());

const mongoURI = process.env.PRODUCTION
  ? "mongodb://mongo:27017"
  : "mongodb://0.0.0.0:27017";

const databaseAUTHToken = [...Array(32)]
  .map(() => Math.random().toString(36)[2])
  .join("");

let db: Db;

// Connect to MongoDB
MongoClient.connect(mongoURI)
  .then((client) => {
    console.log("Connected to MongoDB");
    db = client.db("admin");

    matches.applyRoutes(app, db, dirName);
    tba.applyRoutes(app, dirName);
    notes.applyRoutes(app, db);
  })
  .catch((error) => console.error(`Cannot connect: \n${error}`))
  .then(() => {});

app.delete("/Database", async (req: Request, res: Response) => {
  if (!db) {
    return res.status(500).send("Database not connected");
  }
  const authToken = req.headers.authorization;

  if (authToken !== databaseAUTHToken) {
    return res.status(401).send("Unauthorized");
  }

  const matchCollection = db.collection("matches");
  const notesCollection = db.collection("notes");
  try {
    const items = await matchCollection.deleteMany();
    const notes = await notesCollection.deleteMany();
    res.status(200).json({ items, notes });
  } catch (error) {
    res.status(500).send(error);
  }
});

console.log("Is Production: " + !!process.env.PRODUCTION);
console.log("Database AUTH Token: " + databaseAUTHToken);

const server = (
  sslOptions.key === "" ? app : https.createServer(sslOptions, app)
).listen(port, hostname, () =>
  console.log(`Server is listening on ${hostname}:${port}`)
);

ViteExpress.bind(app, server);
