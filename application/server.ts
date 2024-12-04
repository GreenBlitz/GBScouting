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
app.post("/Match", async (req: Request, res: Response) => {
  if (!db) {
    return res.status(500).send("Database not connected");
  }
  const matchCollection = db.collection("matches");
  const matchData = req.body;

  try {
    const items = (await matchCollection.find().toArray()).filter((item) => {
      return (
        matchData["Team Number"] === item["Team Number"] &&
        matchData["Qual"] === item["Qual"]
      );
    });
    if (items.length > 0) {
      res.status(400).send("Match Already In Database");
    } else {
      const result = await matchCollection.insertOne(matchData);
      res.status(201).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to insert data" });
  }
});

//REMEMBER TO ADD AUTHENTICATION BEFORE DEPLOYMENT IN COMPETITION
app.delete("/Matches", async (req, res) => {
  if (!db) {
    return res.status(500).send("Database not connected");
  }
  const matchCollection = db.collection("matches");
  try {
    const items = await matchCollection.deleteMany();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/Matches", async (req, res) => {
  if (!db) {
    return res.status(500).send("Database not connected");
  }
  const matchCollection = db.collection("matches");
  try {
    const items = await matchCollection.find().toArray();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/Matches/:type/:value", async (req, res) => {
  if (!db) {
    return res.status(500).send("Database not connected");
  }
  const matchCollection = db.collection("matches");
  try {
    const items = (await matchCollection.find().toArray()).filter((item) => {
      if (req.params.type) {
        return item[req.params.type] === req.params.value;
      }
      return true;
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).send(error);
  }
});
console.log("Is Production: " + process.env.PRODUCTION);

const server = (
  sslOptions.key === "" ? app : https.createServer(sslOptions, app)
).listen(port, hostname, () =>
  console.log(`Server is listening on ${hostname}:${port}`)
);

ViteExpress.bind(app, server);
