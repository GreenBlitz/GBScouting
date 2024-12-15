import React from "react";
import ScouterQuery from "../ScouterQuery";

class TextQuery extends ScouterQuery<string> {
  instantiate(): React.JSX.Element {
    return <TextQuery {...this.props} />;
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

export default TextQuery;
