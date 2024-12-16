import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";

class ListInput extends ScouterInput<string, { list: string[] }> {
  instantiate(): React.JSX.Element {
    return <ListInput {...this.props} />;
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
  getInitialValue(props: InputProps<string> & { list: string[] }): string {
    return props.list[0];
  }
}

export default ListInput;
