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
        id={this.props.storage.name}
        name={this.props.storage.name}
        required={this.props.required}
        defaultValue={this.props.storage.get()}
        onChange={(event) =>
          this.props.storage.set(parseInt(event.target.value))
        }
      />
    );
  }
}

export default NumberQuery;
