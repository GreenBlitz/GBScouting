import { BaseClassScouterInput, BaseScouterInput, useInputStorage } from "./BaseScouterInput";


const CreateDropdown = <Options extends string>() => {
  const Dropdown: BaseScouterInput<Options, { dropdownOptions: Options[] }> = ({
    defaultValue,
    name,
    dropdownOptions,
  }) => {
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
  return Dropdown;
};


class DropdownScouterInput<Options extends string> extends BaseClassScouterInput<Options, { dropdownOptions: Options[] }> {
    render() {
        const Dropdown = CreateDropdown<Options>();
        return <Dropdown {...this.props} />;
    }
}

export default DropdownScouterInput;
