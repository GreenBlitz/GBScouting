import React from "react";
import ScouterQuery from "../ScouterQuery";

class TextQuery extends ScouterQuery<string> {
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
        defaultValue={this.storage.get()}
        onChange={(event) =>
          this.storage.set(event.target.value)
        }
      />
    );
  }
}

export default TextQuery;
