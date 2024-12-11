import React from "react";
import ScouterQuery from "../ScouterQuery";

class CheckboxQuery extends ScouterQuery<boolean> {
  renderInput(): React.ReactNode {
    return (
      <input
        type="checkbox"
        id={this.props.storage.name}
        name={this.props.storage.name}
        required={this.props.required}
        onChange={() => this.props.storage.set(!this.props.storage.get())}
        defaultChecked={this.props.storage.get()}
      />
    );
  }
  
  getInitialValue(): boolean {
    return this.props.defaultValue || false;
  }
}

export default CheckboxQuery;
