import React from "react";
import ScouterInput from "../ScouterInput";

class CheckboxInput extends ScouterInput<boolean> {
  instantiate(): React.JSX.Element {
    return <CheckboxInput {...this.props} />;
  }
  renderInput(): React.ReactNode {
    return (
      <input
        type="checkbox"
        id={this.storage.name}
        name={this.storage.name}
        required={this.props.required}
        onChange={() => this.storage.set(!this.storage.get())}
        defaultChecked={this.storage.get() || false}
      />
    );
  }

  getInitialValue(): boolean {
    return this.props.defaultValue || false;
  }
}

export default CheckboxInput;
