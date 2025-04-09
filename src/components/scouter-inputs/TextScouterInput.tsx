import { BaseScouterInput, useInputStorage } from "./BaseScouterInput";

const TextScouterInput: BaseScouterInput<string> = ({ defaultValue, name }) => {
  const [value, setValue] = useInputStorage(name, defaultValue || "");

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export default TextScouterInput;
