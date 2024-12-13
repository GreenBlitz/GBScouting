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
    this.storage.set(matches.filter((match) => removedMatch !== match));
  }

  static getAll(): Match[] {
    return this.storage.get() || [];
  }
}
