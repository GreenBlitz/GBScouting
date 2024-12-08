import React from "react";
import { queryFolder } from "../../utils/FolderStorage";
import ScouterQuery, { QueryProps } from "../ScouterQuery";

class TextQuery extends ScouterQuery<string> {
  getInitialValue(): string {
    return "";
  }

  renderInput(): React.ReactNode {
    return (
      <input
        type="text"
        id={this.props.storage.name}
        name={this.props.storage.name}
        required={this.props.required}
        defaultValue={this.props.storage.get()}
        onChange={(event) =>
          this.props.storage.set(event.target.value)
        }
      />
    );
  }
}

export default TextQuery;
