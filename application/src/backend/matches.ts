import { Express, Request, Response } from "express";
import { Db } from "mongodb";
import fs from "fs";
import path from "path";
import * as serde from "../utils/Serde";

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
  })().substring(0, 10);

  app.delete("/Duplicates", async (req, res) => {
    if (!db) {
      return res.status(500).send("Database not connected");
    }

    const matchCollection = db.collection("matches");
    try {
      const items = await matchCollection.find().toArray();
      const uniqueItems = items.filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            (other) =>
              serde.serialize(
                serde.serdeRecord(serde.qrSerde).serializer,
                other
              ) ===
              serde.serialize(serde.serdeRecord(serde.qrSerde).serializer, item)
          )
      );
      await matchCollection.deleteMany({});
      await matchCollection.insertMany(uniqueItems);

      res.status(200).json(uniqueItems);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  console.log("Getter AUTH Token: " + getterAuthToken);

  app.get("/Matches", async (req, res) => {
    if (!db) {
      return res.status(500).send("Database not connected");
    }

    // const authToken = req.headers.authorization.substring(0, 10);

    // if (getterAuthToken !== authToken) {
    //   return res.status(401).send("Invalid authorization token");
    // }

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

    // const authToken = req.headers.authorization.substring(0, 10);

    // if (getterAuthToken !== authToken) {
    //   return res.status(401).send("Invalid authorization token");
    // }

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

  app.get("/ScouterNames", async (req, res) => {
    if (!db) {
      return res.status(500).send("Database not connected");
    }

    const matchCollection = db.collection("matches");
    try {
      const items = await matchCollection.find().toArray();
      const scouterNames = items
        .map((match) => match.scouterName)
        .filter(Boolean);

      const nameCounts = scouterNames.reduce((acc, name) => {
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});

      const sortedNames = Object.entries(nameCounts)
        .sort((a, b) => Number(b[1]) - Number(a[1])) // Sort by count in descending order
        .map(([name, count]) => ({ name, count })); // Convert to array of objects

      res.status(200).json(sortedNames);
    } catch (error) {
      res.status(500).send(error);
    }
  });
}
