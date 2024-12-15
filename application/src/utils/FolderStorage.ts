import { Match } from "../Utils";

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
  entries(): [string, string | null][] {
    return this.keys().map((key) => [key, this.getItem(key)]);
  }
  values(): (string | null)[] {
    return this.keys().map((key) => this.getItem(key));
  }

  with(prefix: string): FolderStorage {
    return new FolderStorage(this, prefix);
  }
}

export const localFolder = new FolderStorage(localStorage);
export const sessionFolder = new FolderStorage(sessionStorage);

export const queryFolder = localFolder.with("Queries/");

export class Storable<T> {
  public readonly name: string;
  private readonly storage: FolderStorage | Storage;
  constructor(name: string, storage: FolderStorage | Storage) {
    this.name = name;
    this.storage = storage;
  }

  get(): T | null {
    const unparsedItem = this.storage.getItem(this.name);

    if (unparsedItem === null || undefined) {
      return null;
    }

    try {
      return JSON.parse(unparsedItem);
    } catch {
      return unparsedItem as T;
    }
  }

  set(value: T): void {
    if (typeof value === "string") {
      this.storage.setItem(this.name, value);
      return;
    }
    this.storage.setItem(this.name, JSON.stringify(value));
  }

  remove() {
    this.storage.removeItem(this.name);
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