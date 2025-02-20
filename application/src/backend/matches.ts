import { Express, Request, Response } from "express";
import { Db } from "mongodb";
import fs from "fs";
import path from "path";

export function applyRoutes(app: Express, db: Db, dirName: string) {
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

  const getterAuthToken = (() => {
    try {
      return fs.readFileSync(path.resolve(dirName, "get-token.txt")).toString();
    } catch (error) {
      return "";
    }
  })();

  console.log("Getter AUTH Token: " + getterAuthToken);

  app.get("/Matches", async (req, res) => {
    if (!db) {
      return res.status(500).send("Database not connected");
    }

    const authToken = req.headers.authorization;
    if (getterAuthToken !== authToken) {
      return res
        .status(401)
        .send(
          "Invalid authorization token, " + authToken + " != " + getterAuthToken
        );
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
    const authToken = req.headers.authorization;
    if (getterAuthToken !== authToken) {
      return res
        .status(401)
        .send(
          "Invalid authorization token, " + authToken + " != " + getterAuthToken
        );
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
}
