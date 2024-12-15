import React from "react";
import ScouterQuery, { QueryProps } from "../ScouterQuery";

class ListQuery extends ScouterQuery<string, { list: string[] }> {
  instantiate(): React.JSX.Element {
    return <ListQuery {...this.props} />;
  }
  renderInput(): React.ReactNode {
    return (
      <select
        name={this.storage.name}
        id={this.storage.name}
        required={this.props.required}
        defaultValue={this.storage.get() || this.props.list[0]}
        onChange={(event) => this.storage.set(event.target.value)}
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
