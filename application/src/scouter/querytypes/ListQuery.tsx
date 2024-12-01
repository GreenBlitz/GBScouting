import React, { useEffect } from "react";
import { queryFolder } from "../../utils/FolderStorage";
import ScouterQuery, { QueryProps } from "../ScouterQuery";

class ListQuery extends ScouterQuery<string, {}, { list: string[] }> {
  getStartingState(props: QueryProps<string> & { list: string[] }): {} {
    return {};
  }

  renderInput(): React.ReactNode {
    return (
      <select
        name={this.props.name}
        id={this.props.name}
        required={this.props.required}
        defaultValue={queryFolder.getItem(this.props.name) || ""}
        onChange={(event) =>
          queryFolder.setItem(this.props.name, event.target.value)
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
