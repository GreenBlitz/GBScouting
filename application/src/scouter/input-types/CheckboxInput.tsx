import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";

class CheckboxInput extends ScouterInput<boolean> {
  create(): React.JSX.Element {
    return <CheckboxInput {...this.props} />;
  }
  renderInput(): React.ReactNode {
    return (
      <div className="">
        <input
          type="checkbox"
          id={this.storage.name}
          name={this.storage.name}
          className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-2 dark:border-dark-border dark:bg-dark-card dark:checked:bg-primary-500 dark:focus:ring-offset-dark-bg transition-colors duration-200"
          required={this.props.required}
          onChange={() => this.storage.set(!this.getValue())}
          defaultChecked={this.getValue()}
        />
      </div>
    );
  }

  initialValue(): boolean {
    return false;
  }
}

export default CheckboxInput;
