import { Express, Request, Response } from "express";
import { Db } from "mongodb";

export function applyRoutes(app: Express, db: Db) {
  // Define routes
  app.post("/notes/:qual", async (req: Request, res: Response) => {
    if (!db) {
      return res.status(500).send("Database not connected");
    }
    const notesCollection = db.collection("notes");

    const newNotes = {
      qual: req.params.qual,
      body: req.body,
    };

    try {
      const notes = await notesCollection.find().toArray();
      const stringedNotes = JSON.stringify(newNotes);
      const similarMatch = notes.find((value) => {
        const { _id, ...unIdDValue } = value;
        const jsoned = JSON.stringify(unIdDValue);
        return stringedNotes === jsoned;
      });

      if (similarMatch) {
        res.status(401).send("Notes Already In Database");
        return;
      }

      const result = await notesCollection.insertOne(newNotes);

      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to insert data" });
    }
  });

  app.get("/team_notes/:team", async (req: Request, res: Response) => {
    if (!db) {
      return res.status(500).send("Database not connected");
    }
    const notesCollection = db.collection("notes");
    try {
      const items = (await notesCollection.find().toArray())
        .map((item) => {
          const found = Object.entries(item.body).find(
            ([teamNumber, _]) => teamNumber === req.params.team
          );
          if (!found) {
            return undefined;
          }
          return {
            qual: item.qual,
            body: found[1],
          };
        })
        .filter((item) => item);
      console.log(items);
      res.status(200).json(items);
    } catch (error) {
      res.status(500).send(error);
    }
  });
}
