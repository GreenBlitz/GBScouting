import { inputFolder } from "./FolderStorage";

class Storage {
  private static instance: Storage;

  private constructor() {}

  public static getInstance(): Storage {
    if (!Storage.instance) {
      Storage.instance = new Storage();
    }
    return Storage.instance;
  }

  public reset(): void {
    inputFolder.keys().forEach((item) => inputFolder.removeItem(item));
  }

  public submit(): void {
    // Clear storage after submitting
    this.reset();
  }
}

export function getStorage(): Storage {
  return Storage.getInstance();
}
