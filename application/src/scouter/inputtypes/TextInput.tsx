import React from "react";
import ScouterInput from "../ScouterInput";

class TextInput extends ScouterInput<string> {
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
        defaultValue={this.storage.get()?.toString()}
        onChange={(event) => this.storage.set(event.target.value)}
      />
    );
  }
}

export default TextInput;
