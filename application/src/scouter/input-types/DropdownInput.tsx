import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";

class DropdownInput<Option extends string, Options extends Option[]> extends ScouterInput<Options[number], { options: Options }> {
  create(): React.JSX.Element {
    return <DropdownInput {...this.props} />;
  }
  renderInput(): React.ReactNode {
    return (
      <select
        name={this.storage.name}
        id={this.storage.name}
        required={this.props.required}
        defaultValue={this.getValue()}
        onChange={(event) => this.storage.set(event.target.value as Option)}
        className="w-full p-2 bg-dark-bg text-dark-text border border-dark-border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        {this.props.options.map((item, index) => (
          <option value={item} key={index} className="bg-dark-bg text-dark-text">
            {item}
          </option>
        ))}
      </select>
    );
  }
  initialValue(props: InputProps<Option> & { options: Options }): Option {
    return props.options[0];
  }
}

export default DropdownInput;
