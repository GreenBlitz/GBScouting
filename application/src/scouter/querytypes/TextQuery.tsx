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
        id={this.props.name}
        name={this.props.name}
        required={this.props.required}
        defaultValue={queryFolder.getItem(this.props.name) || ""}
        onChange={(event) =>
          queryFolder.setItem(this.props.name, event.target.value)
        }
      />
    );
  }
}

export default TextQuery;
