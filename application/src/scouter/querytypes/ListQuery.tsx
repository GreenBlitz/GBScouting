import React from "react";
import ScouterQuery, { QueryProps } from "../ScouterQuery";

class ListQuery extends ScouterQuery<string, { list: string[] }> {
  renderInput(): React.ReactNode {
    return (
      <select
        name={this.props.storage.name}
        id={this.props.storage.name}
        required={this.props.required}
        defaultValue={this.props.storage.get()}
        onChange={(event) =>
          this.props.storage.set(event.target.value)
        }
      >
        {this.props.list.map((item, index) => (
          <option value={item} key={index}>
            {item}
          </option>
        ))}
      </select>
    );
  }
  getInitialValue(props: QueryProps<string> & { list: string[] }): string {
    return props.list[0];
  }
}

export default ListQuery;
