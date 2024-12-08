export default class FolderStorage {
  private prefix: string;
  public readonly parent: Storage | FolderStorage;

  constructor(parent: Storage | FolderStorage, prefix?: string) {
    this.prefix = prefix ? prefix : "";
    this.parent = parent;
  }

  clear(): void {
    this.keys()
      .filter((key) => key.startsWith(this.prefix))
      .forEach((key) => this.removeItem(key));
  }
  getItem(key: string): string | null {
    return this.parent.getItem(this.prefix + key);
  }
  key(index: number): string | null {
    let count = 0;
    for (const key in this.keys()) {
      if (count === index) {
        return key;
      }
      count++;
    }
    return null;
  }
  removeItem(key: string): void {
    this.parent.removeItem(this.prefix + key);
  }
  setItem(key: string, value: string): void {
    this.parent.setItem(this.prefix + key, value);
  }

  keys(): string[] {
    const isParentFolder = this.parent.keys !== undefined;
    const parentKeys = isParentFolder
      ? this.parent.keys()
      : Object.keys(this.parent);
    return parentKeys
      .filter((key) => key.startsWith(this.prefix))
      .map((key) => key.slice(this.prefix.length));
  }
  entries() {
    return this.keys().map((key) => [key, this.getItem(key)]);
  }
  values() {
    return this.keys().map((key) => this.getItem(key));
  }

  with(prefix: string) {
    return new FolderStorage(this, prefix);
  }
}

export const localFolder = new FolderStorage(localStorage);
export const sessionFolder = new FolderStorage(sessionStorage);

export const queryFolder = localFolder.with("Queries/");
export const matchFolder = localFolder.with("Matches/");

abstract class Storable<T> {
  public readonly name: string;
  private readonly storage: FolderStorage | Storage;
  constructor(name: string, storage: FolderStorage | Storage) {
    this.name = name;
    this.storage = storage;
  }

  get(): T;
  get(checker?: T): T {
    const stringRepresentation = this.storage.getItem(this.name) + "";

    const typeCheck = checker || "";
    if (typeof typeCheck === "string") {
      //very stupid string shenanigans
      return stringRepresentation as T;
    }

    return JSON.parse(stringRepresentation);
  }

  set(value: T): void {
    if (typeof value === "string") {
      this.storage.setItem(this.name, value);
      return;
    }
    this.storage.setItem(this.name, JSON.stringify(value));
  }

  toString() {
    return JSON.stringify(this.get());
  }

  exists(): boolean {
    return !!queryFolder.getItem(this.name);
  }
}

export class QueryStorable<T> extends Storable<T> {
  constructor(name: string) {
    super(name, queryFolder);
  }
}

export class Queries {
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
