import {  ScouterInputProps, useInputStorage } from "./BaseScouterInput";

const TextScouterInput: React.FC<ScouterInputProps<string>> = ({ defaultValue, name }) => {
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
