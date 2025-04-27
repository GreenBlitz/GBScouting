import { ScouterInputProps, useInputStorage } from "./BaseScouterInput";

const DropdownScouterInput = <Options extends string>({
  defaultValue,
  name,
  dropdownOptions,
}: ScouterInputProps<Options, { dropdownOptions: readonly Options[]}>) => {
  const [value, setValue] = useInputStorage(name, defaultValue || "");

  return (
    <select value={value} onChange={(e) => setValue(e.target.value)}>
      {dropdownOptions.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default DropdownScouterInput;
