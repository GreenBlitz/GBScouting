import express, { Request, Response } from "express";
import { Db, MongoClient } from "mongodb";
import ViteExpress from "vite-express";
import fs from "fs";
import path from "path";
import https from "https";
import cors from "cors";
import axios from "axios";

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

const mongoURI = process.env.PRODUCTION ? "mongodb://mongo:27017" : "mongodb://0.0.0.0:27017";

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
    const result = await matchCollection.insertOne(matchData);
    res.status(201).json(result);
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
      return item[req.params.type].toString() === req.params.value;
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).send(error);
  }
});

console.log("Is Production: " + !!process.env.PRODUCTION);

app.get("/TheBlueAlliance-event-leaderboard/:event", async (req, res) => {
  try {
    // Read API key from file
    const tbaKey = fs.readFileSync(path.resolve(dirName, "TBAkey.txt"), "utf8").trim();

    // Set request headers
    const headers = {
      "X-TBA-Auth-Key": tbaKey,
      "Content-Type": "application/json",
    };

    // Fetch rankings from The Blue Alliance API
    const response = await axios.get(
      `https://www.thebluealliance.com/api/v3/event/${req.params.event}/rankings`,
      { headers }
    );

    // Send response back to the client
    res.json(response.data);
  } catch (error) {
    console.error("Error calling TBA API:", error);
    res.status(500).json({ error: "Failed to fetch qualification rankings" });
  }
});

app.get("/TheBlueAlliance-match-results/:matchKey", async (req: Request, res: Response) => {
  try {
    const matchKey = req.params.matchKey; // Get match key from request

    // Read TBA API Key from file
    const tbaKey = fs.readFileSync(path.resolve(dirName, "TBAkey.txt"), "utf8").trim();

    // Set headers for API request
    const headers = {
      "X-TBA-Auth-Key": tbaKey, // Authentication key
      "Content-Type": "application/json",
    };

    // Fetch match data from The Blue Alliance API
    const response = await axios.get(
      `https://www.thebluealliance.com/api/v3/match/${matchKey}`,
      { headers }
    );

    // Send the match result back to the frontend
    res.json(response.data);
  } catch (error) {
    console.error("Error calling TBA API:", error);
    res.status(500).json({ error: "Failed to fetch match results" });
  }
});


const server = (
  sslOptions.key === "" ? app : https.createServer(sslOptions, app)
).listen(port, hostname, () =>
  console.log(`Server is listening on ${hostname}:${port}`)
);

ViteExpress.bind(app, server);
