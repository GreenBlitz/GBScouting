import { QueryStorable } from "../utils/FolderStorage";

export default class Queries {
    static readonly ScouterName: QueryStorable<string> = new QueryStorable(
      "Scouter Name"
    );
    static readonly Qual: QueryStorable<number> = new QueryStorable("Qual");
    static readonly TeamNumber: QueryStorable<number> = new QueryStorable(
      "Team Number"
    );
    static readonly GameSide: QueryStorable<string> = new QueryStorable(
      "Game Side"
    );
    static readonly StartingPosition: QueryStorable<string> = new QueryStorable(
      "Starting Position"
    );
    static readonly SpeakerAutoScore: QueryStorable<number> = new QueryStorable(
      "Speaker/Auto/Score"
    );
    static readonly SpeakerAutoMiss: QueryStorable<number> = new QueryStorable(
      "Speaker/Auto/Miss"
    );
    static readonly AmpScore: QueryStorable<number> = new QueryStorable(
      "CRESCENDO/Amp/Score"
    );
    static readonly AmpMiss: QueryStorable<number> = new QueryStorable(
      "CRESCENDO/Amp/Miss"
    );
    static readonly Climb: QueryStorable<string> = new QueryStorable("Climb");
    static readonly Trap: QueryStorable<string> = new QueryStorable("Trap");
    static readonly Comment: QueryStorable<string> = new QueryStorable("Comment");
  }
  