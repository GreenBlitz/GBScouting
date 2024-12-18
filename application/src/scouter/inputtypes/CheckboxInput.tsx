import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";

class CheckboxInput extends ScouterInput<boolean> {
  create(): React.JSX.Element {
    return <CheckboxInput {...this.props} />;
  }
  renderInput(): React.ReactNode {
    return (
      <input
        type="checkbox"
        id={this.storage.name}
        name={this.storage.name}
        required={this.props.required}
        onChange={() => this.storage.set(!this.getValue())}
        defaultChecked={this.getValue()}
      />
    );
  }

  initialValue(): boolean {
    return false;
  }
}

export default CheckboxInput;
