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
        defaultValue={this.getValue()}
        onChange={(event) => this.storage.set(parseInt(event.target.value))}
        className="w-full p-2 bg-dark-bg text-dark-text border border-dark-border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
    );
  }
}

export default NumberInput;
