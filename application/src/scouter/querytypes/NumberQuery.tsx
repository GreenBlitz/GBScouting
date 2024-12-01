import React from "react";
import { queryFolder } from "../../utils/FolderStorage";
import ScouterQuery, { QueryProps } from "../ScouterQuery";

class NumberQuery extends ScouterQuery<number> {
  getStartingState(props: QueryProps<number>) {
    return {};
  }

  getInitialValue(): number {
    return 0;
  }

  renderInput(): React.ReactNode {
    return (
      <input
        type="number"
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

export default NumberQuery;
