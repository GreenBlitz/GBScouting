import React, { useEffect } from "react";
import { queryFolder } from "../../utils/FolderStorage";
import ScouterQuery from "../ScouterQuery";

class CheckboxQuery extends ScouterQuery<boolean> {
  renderInput(): React.ReactNode {
    const updateCheckbox = () => {
      const newValue =
        queryFolder.getItem(this.props.name) === "true" ? "false" : "true";
      queryFolder.setItem(this.props.name, newValue);
    };
    return (
      <input
        type="checkbox"
        id={this.props.name}
        name={this.props.name}
        required={this.props.required}
        onChange={updateCheckbox}
        defaultChecked={queryFolder.getItem(this.props.name) === "true"}
      />
    );
  }
  getInitialValue(): boolean {
    return this.props.defaultValue || false;
  }
}

export default CheckboxQuery;
