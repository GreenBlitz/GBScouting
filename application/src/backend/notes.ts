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

type HashedQualTeam = `frc${number} qual${number}`;

type QualNotes = Record<HashedQualTeam, Notes>;

export function applyRoutes(app: Express, db: Db) {
  // Define routes
  app.post("/team_notes", async (req, res) => {
    const { notes, user }: { notes: QualNotes; user: string } = req.body;
    if (
      !notes ||
      !user ||
      typeof notes !== "object" ||
      typeof user !== "string"
    ) {
      return res.status(400).json({ message: "Missing notes or user" });
    }

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

  app.get("/team_notes/team/:team", async (req: Request, res: Response) => {
    const team = req.params.team;

    const notesCollection = db.collection("notes");

    try {
      const notesCursor = notesCollection.find({
        team: new RegExp(`^frc${team} qual`),
      });
      const notesArray = await notesCursor.toArray();
      const notes: QualNotes = notesArray.reduce((acc, curr) => {
        const { user, team, ...note } = curr;
        acc[team] = note as unknown as Notes;
        return acc;
      }, {} as QualNotes);
      res.status(200).json(notes);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error retrieving notes" });
    }
  });

  app.get("/team_notes/all", async (req: Request, res: Response) => {
    const notesCollection = db.collection("notes");
    try {
      const notesCursor = notesCollection.find({});
      const notesArray = await notesCursor.toArray();
      const notes: QualNotes = notesArray.reduce((acc, curr) => {
        const { user, team, ...note } = curr;
        acc[team] = note as unknown as Notes;
        return acc;
      }, {} as QualNotes);
      res.status(200).json(notes);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error retrieving notes" });
    }
  });
}
