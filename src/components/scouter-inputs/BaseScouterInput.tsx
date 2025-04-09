import { localFolder, StorageBacked } from "../../utils/FolderStorage";

const inputStorage = localFolder.with("inputs/");

class StorageBackedInput<T> extends StorageBacked<T> {
  constructor(name: string) {
    super(name, inputStorage);
  }
}

interface BaseScouterInputProps<T> {
  storage: StorageBackedInput<T>;
  defaultValue?: T;
}

type BaseScouterInput<T> = React.FC<BaseScouterInputProps<T>>;
export default BaseScouterInput;
