import { useState } from "react";
import { localFolder, StorageBacked } from "../../utils/FolderStorage";

const inputStorage = localFolder.with("inputs/");

class StorageBackedInput<T> extends StorageBacked<T> {
  constructor(name: string) {
    super(name, inputStorage);
  }
}

export type ScouterInputElement = React.ReactElement<
  BaseScouterInputProps<any>
>;

export interface BaseScouterInputProps<T> {
  name: string;
  defaultValue?: T;
}

export const useInputStorage = <T,>(
  name: string,
  defaultValue: T
): [T, (newValue: T) => void] => {
  const storage = new StorageBackedInput<T>(name);
  const [value, setValue] = useState<T>(storage.get() || defaultValue);

  const setStorageValue = (newValue: T) => {
    setValue(newValue);
    storage.set(newValue);
  };
  return [value, setStorageValue];
};

export type BaseScouterInput<T> = React.FC<BaseScouterInputProps<T>>;
