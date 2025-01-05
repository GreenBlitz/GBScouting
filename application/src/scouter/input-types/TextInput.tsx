import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";
import { serdeString } from "../../utils/Serde";

class TextInput extends ScouterInput<string> {
  constructor(props: InputProps<string>,bits: number) {
    super(props, serdeString(bits));
  }

  create(): React.JSX.Element {
    return <TextInput {...this.props} />;
  }
  initialValue(): string {
    return "";
  }

  renderInput(): React.ReactNode {
    return (
      <input
        type="text"
        id={this.storage.name}
        name={this.storage.name}
        required={this.props.required}
        defaultValue={this.getValue().toString()}
        onChange={(event) => this.storage.set(event.target.value)}
      />
    );
  }
}

export default TextInput;
