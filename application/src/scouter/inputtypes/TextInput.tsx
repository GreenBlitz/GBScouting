import React from "react";
import ScouterInput from "../ScouterInput";

class TextInput extends ScouterInput<string> {
  instantiate(): React.JSX.Element {
    return <TextInput {...this.props} />;
  }
  getInitialValue(): string {
    return "";
  }

  renderInput(): React.ReactNode {
    return (
      <input
        type="text"
        id={this.storage.name}
        name={this.storage.name}
        required={this.props.required}
        defaultValue={this.storage.get()?.toString()}
        onChange={(event) => this.storage.set(event.target.value)}
      />
    );
  }
}

export default TextInput;
