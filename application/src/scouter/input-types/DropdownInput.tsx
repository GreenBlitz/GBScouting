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
      >
        {this.props.options.map((item, index) => (
          <option value={item} key={index}>
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
