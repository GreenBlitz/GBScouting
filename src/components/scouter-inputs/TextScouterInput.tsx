import { useState, useEffect } from "react";
import BaseScouterInput from "./BaseScouterInput";


const TextScouterInput: BaseScouterInput<string> = ({
  storage,
  defaultValue,
}) => {
  const [value, setValue] = useState<string>(
    storage.get() ?? defaultValue ?? ""
  );

  useEffect(() => {
    storage.set(value);
  }, [value, storage]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
