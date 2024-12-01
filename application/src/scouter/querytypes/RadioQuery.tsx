import React, { useEffect } from "react";
import { queryFolder } from "../../utils/FolderStorage";
import ScouterQuery, { QueryProps } from "../ScouterQuery";

class RadioQuery extends ScouterQuery<string, {}, { list: string[] }> {
  getStartingState(props: QueryProps<string> & { list: string[] }): {} {
    return {};
  }

  renderInput(): React.ReactNode {
    return this.props.list.map((item, index) => (
      <React.Fragment key={index}>
        <input
          type="radio"
          id={item}
          name={this.props.name}
          value={item}
          required={this.props.required}
          onChange={() => queryFolder.setItem(this.props.name, item)}
          defaultChecked={item === queryFolder.getItem(this.props.name)}
        />
        <label htmlFor={item}>{item}</label>
      </React.Fragment>
    ));
  }
  getInitialValue(props: QueryProps<string> & { list: string[] }): string {
    return props.list[0];
  }
} 

export default RadioQuery;
