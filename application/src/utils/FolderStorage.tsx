export default class FolderStorage implements Storage {
  [name: string]: any;
  length: number;

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
        return key.slice(this.prefix.length);
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

  keys() {
    return Object.keys(this.parent)
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
export const matchFolder = localFolder.with("Matches/")

