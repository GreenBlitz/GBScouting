import { Express, Request, Response } from "express";
import { Db } from "mongodb";

export function applyRoutes(app: Express, db: Db) {
  // Define routes
  app.post("/notes/:qual", async (req: Request, res: Response) => {
    if (!db) {
      return res.status(500).send("Database not connected");
    }
    const notesCollection = db.collection("notes");
    const notesData: Record<string, string> = req.body;

    const notes = {
      qual: req.params.qual,
      body: notesData,
    };

    try {
      notesCollection.deleteMany();
      const result = await notesCollection.insertOne(notes);

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
      res.status(200).json(items);
    } catch (error) {
      res.status(500).send(error);
    }
  });
}
