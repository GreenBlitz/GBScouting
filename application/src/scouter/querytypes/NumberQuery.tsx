import React from "react";
import ScouterQuery from "../ScouterQuery";

class NumberQuery extends ScouterQuery<number> {
  Instantiate(): React.JSX.Element {
    return <NumberQuery {...this.props}/>
  }
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
        defaultValue={this.storage.get() || 0}
        onChange={(event) => this.storage.set(parseInt(event.target.value))}
      />
    );
  }
}

export default NumberQuery;
