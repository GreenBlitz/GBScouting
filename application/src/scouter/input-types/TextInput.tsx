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
        defaultValue={this.getValue().toString()}
        onChange={(event) => this.storage.set(event.target.value)}
        className="w-full p-2 bg-dark-bg text-dark-text border border-dark-border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
    );
  }
}

export default TextInput;
