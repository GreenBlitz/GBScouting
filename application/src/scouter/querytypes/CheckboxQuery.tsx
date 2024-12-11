import React from "react";
import ScouterQuery from "../ScouterQuery";

class CheckboxQuery extends ScouterQuery<boolean> {
  renderInput(): React.ReactNode {
    return (
      <input
        type="checkbox"
        id={this.storage.name}
        name={this.storage.name}
        required={this.props.required}
        onChange={() => this.storage.set(!this.storage.get())}
        defaultChecked={this.storage.get()}
      />
    );
  }

  getInitialValue(): boolean {
    return this.props.defaultValue || false;
  }
}

export default CheckboxQuery;
