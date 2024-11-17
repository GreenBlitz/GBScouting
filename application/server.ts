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

const mongoURI = "mongodb://localhost:27017";

let db: Db;

// Connect to MongoDB
MongoClient.connect(mongoURI)
  .then((client) => {
    console.log("Connected to MongoDB");
    db = client.db("admin");
  })
  .catch((error) => console.error(`Cannot connect: \n${error}`));

// Define routes

app.get("/messages", async (req, res) => {
  if (!db) {
    res.status(500).send("No database");
  }
  const messageCollection = db.collection("messages"  );
  try {
    const messages = await messageCollection.find().toArray();
    res.status(200).json(messages);
  }
  catch (exception) {
    res.status(500).send("Cant get collection")
  }
})




const server = (
  sslOptions.key === "" ? app : https.createServer(sslOptions, app)
).listen(port, hostname, () =>
  console.log(`Server is listening on ${hostname}:${port}`)
);

  ViteExpress.bind(app, server);

