import express, { Request, Response } from "express";
import { Db, MongoClient } from "mongodb";
import ViteExpress from "vite-express";
import fs from "fs";
import path from "path";
import https from "https";
import cors from "cors";

const app = express();
const hostname = "0.0.0.0";
const port = 4590;

const dirName = "/app";

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

const mongoURI = "mongodb://mongo:27017";

let db: Db;

// Connect to MongoDB
MongoClient.connect(mongoURI)
  .then((client) => {
    console.log("Connected to MongoDB");
    db = client.db("admin");
  })
  .catch((error) => console.error(`Cannot connect: \n${error}`));

// Define routes




const server = (
  sslOptions.key === "" ? app : https.createServer(sslOptions, app)
).listen(port, hostname, () =>
  console.log(`Server is listening on ${hostname}:${port}`)
);

  ViteExpress.bind(app, server);

