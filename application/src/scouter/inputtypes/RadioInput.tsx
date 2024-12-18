import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";

class RadioInput extends ScouterInput<string, { options: string[] }> {
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
  initialValue(props: InputProps<string> & { options: string[] }): string {
    return props.options[0];
  }
}

export default RadioInput;
