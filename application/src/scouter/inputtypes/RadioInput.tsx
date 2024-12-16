import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";

class RadioInput extends ScouterInput<string, { list: string[] }> {
  instantiate(): React.JSX.Element {
    return <RadioInput {...this.props} />;
  }

  renderInput(): React.ReactNode {
    return this.props.list.map((item, index) => (
      <React.Fragment key={index}>
        <input
          type="radio"
          id={item}
          name={this.storage.name}
          value={item}
          required={this.props.required}
          onChange={() => this.storage.set(item)}
          defaultChecked={item === this.storage.get()}
        />
        <label htmlFor={item}>{item}</label>
      </React.Fragment>
    ));
  }
  getInitialValue(props: InputProps<string> & { list: string[] }): string {
    return props.list[0];
  }
}

export default RadioInput;
