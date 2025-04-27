import { BaseScouterInput, useInputStorage } from "./BaseScouterInput";

const NumberScouterInput: BaseScouterInput<number> = ({ defaultValue, name }) => {
  const [value, setValue] = useInputStorage(name, defaultValue || 0);

  return (
    <input
      type="number"
      value={value}
      onChange={(e) => setValue(parseInt(e.target.value))}
    />
  );
};

export default NumberScouterInput;
