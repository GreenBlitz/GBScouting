import React from "react";
import ScouterQuery from "../ScouterQuery";

class NumberQuery extends ScouterQuery<number> {
  getInitialValue(): number {
    return 0;
  }

  renderInput(): React.ReactNode {
    return (
      <input
        type="number"
        id={this.storage.name}
        name={this.storage.name}
        required={this.props.required}
        defaultValue={this.storage.get()}
        onChange={(event) => this.storage.set(parseInt(event.target.value))}
      />
    );
  }
}

export default NumberQuery;
