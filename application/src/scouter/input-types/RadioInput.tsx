import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";

class RadioInput<Option extends string, Options extends Option[]> extends ScouterInput<Option, { options: Options }> {
  create(): React.JSX.Element {
    throw <RadioInput {...this.props}/>;
  }

  renderInput(): React.ReactNode {
    return this.props.options.map((item, index) => (
      <React.Fragment key={index}>
        <input
          type="radio"
          id={item}
          name={this.storage.name}
          value={item}
          required={this.props.required}
          onChange={() => this.storage.set(item)}
          defaultChecked={item === this.getValue()}
        />
        <label htmlFor={item}>{item}</label>
      </React.Fragment>
    ));
  }
  initialValue(props: InputProps<string> & { options: Options }): Option {
    return props.options[0];
  }
}

export default RadioInput;
