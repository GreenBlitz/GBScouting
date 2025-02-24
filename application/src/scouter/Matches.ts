import { StorageBacked } from "../utils/FolderStorage";
import { Match } from "../utils/Match";

export default class Matches {
  static storage: StorageBacked<Match[]> = new StorageBacked(
    "matches",
    localStorage
  );

  static add(match: Match): void {
    const matches = this.getAll();
    this.storage.set(matches.concat(match));
  }

  static remove(removedMatch: Match): void {
    const matches = this.getAll();

    function isMatchEqual(match1: Match, match2: Match) {
      return match1.scouterName === match2.scouterName && match1.qual == match2.qual;
    }

    this.storage.set(
      matches.filter((match) => !isMatchEqual(match, removedMatch))
    );
  }

  static getAll(): Match[] {
    return this.storage.get() || [];
  }
}
