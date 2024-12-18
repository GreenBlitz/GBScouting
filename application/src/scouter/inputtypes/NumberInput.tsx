import React from "react";
import ScouterInput from "../ScouterInput";

class NumberInput extends ScouterInput<number> {
  create(): React.JSX.Element {
    return <NumberInput {...this.props} />;
  }
  initialValue(): number {
    return 0;
  }

  renderInput(): React.ReactNode {
    return (
      <input
        type="number"
        id={this.storage.name}
        name={this.storage.name}
        required={this.props.required}
        defaultValue={this.storage.get() || 0}
        onChange={(event) => this.storage.set(parseInt(event.target.value))}
      />
    );
  }
}

export default NumberInput;
