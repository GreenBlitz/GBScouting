import React from "react";
import ScouterQuery from "../ScouterQuery";

class CheckboxQuery extends ScouterQuery<boolean> {
  instantiate(): React.JSX.Element {
    return <CheckboxQuery {...this.props} />;
  }
  renderInput(): React.ReactNode {
    return (
      <input
        type="checkbox"
        id={this.storage.name}
        name={this.storage.name}
        required={this.props.required}
        onChange={() => this.storage.set(!this.storage.get())}
        defaultChecked={this.storage.get() || false}
      />
    );
  }

  getInitialValue(): boolean {
    return this.props.defaultValue || false;
  }
}

export default CheckboxQuery;
