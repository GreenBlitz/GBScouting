import { Match } from "../Utils";
import { Storable } from "../utils/FolderStorage";

export default class Matches {
  static storage: Storable<Match[]> = new Storable("Matches", localStorage);

  static add(match: Match): void {
    const matches = this.storage.get() || [];
    this.storage.set(matches.concat(match));
  }

  static remove(removedMatch: Match): void {
    const matches = this.storage.get();
    if (matches === null) {
      return;
    }

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
