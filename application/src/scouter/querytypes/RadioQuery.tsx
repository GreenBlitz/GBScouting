import React from "react";
import ScouterQuery, { QueryProps } from "../ScouterQuery";

class RadioQuery extends ScouterQuery<string, { list: string[] }> {
  renderInput(): React.ReactNode {
    return this.props.list.map((item, index) => (
      <React.Fragment key={index}>
        <input
          type="radio"
          id={item}
          name={this.storage.name}
          value={item}
          required={this.props.required}
          onChange={() => this.storage.set(item)}
          defaultChecked={item === this.storage.get()}
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
