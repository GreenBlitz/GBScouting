import { Express, Request, Response } from "express";
import { Db } from "mongodb";

const noteCategories = [
  "defense",
  "evasion",
  "net",
  "coral",
  "climb",
  "driving",
  "overall",
] as const;

type Notes = Record<
  (typeof noteCategories)[number],
  { value: string; score: number }
>;

type QualNote = {
  qual: number;
  team: number;
  note: Notes;
};

export function applyRoutes(app: Express, db: Db) {
  // Define routes
  app.post("/team_notes", async (req, res) => {
    const notes: QualNote[] = req.body.notes;

    const notesCollection = db.collection("notes");

    try {
      const currentNotes = await notesCollection.find().toArray();
      const stringedMatch = JSON.stringify(notes);
    } catch (error) {
      console.log(error);
    }
  });
}
