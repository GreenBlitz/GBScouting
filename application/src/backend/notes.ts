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

export type Notes = Record<
  (typeof noteCategories)[number],
  { value: string; score: number }
>;

export type HashedQualTeam = `frc${number} qual${number}`;

export type QualNotes = Record<HashedQualTeam, Notes>;

export function applyRoutes(app: Express, db: Db) {
  // Define routes
  app.post("/team_notes", async (req, res) => {
    const { notes, user }: { notes: QualNotes; user: string } = req.body;

    const notesCollection = db.collection("notes");

    try {
      await notesCollection.deleteMany({ user });
      notesCollection.insertMany(
        Object.entries(notes).map(([team, note]) => ({ team, ...note, user }))
      );
      res.status(200).json({ message: "Notes saved successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error saving notes" });
    }
  });
}
