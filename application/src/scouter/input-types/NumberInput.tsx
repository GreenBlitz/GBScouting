import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";
import { serdeUnsignedInt } from "../../utils/Serde";

class NumberInput extends ScouterInput<number> {
  constructor(props: InputProps<number>, bitCount: number) {
    super(props, serdeUnsignedInt(bitCount))
  }

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
      />
    );
  }
}

export default NumberInput;
