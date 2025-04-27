import { BaseScouterInput, useInputStorage } from "./BaseScouterInput";


const DropdownScouterInput = <Options,>({ defaultValue, name }) => {
  const [value, setValue] = useInputStorage(name, defaultValue || 0);

  return (
    <input
      type="number"
      value={value}
      onChange={(e) => setValue(parseInt(e.target.value))}
    />
  );
};

const actual: BaseScouterInput<string> = DropdownScouterInput;
export default DropdownScouterInput;
