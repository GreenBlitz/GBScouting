import { Persistent } from "../utils/FolderStorage";
import { Match } from "../utils/Match";

export default class Matches {
  static storage: Persistent<Match[]> = new Persistent("matches", localStorage);

  static add(match: Match): void {
    const matches = this.getAll();
    this.storage.set(matches.concat(match));
  }

  static remove(removedMatch: Match): void {
    const matches = this.getAll();

    function isMatchEqual(match1: Match, match2: Match) {
      Object.values(match1).every(
        (value, index) => Object.values(match2)[index] === value
      );
    }

    this.storage.set(
      matches.filter((match) => isMatchEqual(match, removedMatch))
    );
  }

  static getAll(): Match[] {
    return this.storage.get() || [];
  }
}
