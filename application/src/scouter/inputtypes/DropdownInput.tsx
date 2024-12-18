import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";

class ListInput extends ScouterInput<string, { options: string[] }> {
  create(): React.JSX.Element {
    return <ListInput {...this.props} />;
  }
  renderInput(): React.ReactNode {
    return (
      <select
        name={this.storage.name}
        id={this.storage.name}
        required={this.props.required}
        defaultValue={this.getValue()}
        onChange={(event) => this.storage.set(event.target.value)}
      >
        {this.props.options.map((item, index) => (
          <option value={item} key={index}>
            {item}
          </option>
        ))}
      </select>
    );
  }
  initialValue(props: InputProps<string> & { options: string[] }): string {
    return props.options[0];
  }
}

export default ListInput;
