import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";

class RadioInput extends ScouterInput<string, { options: string[] }> {
  create(): React.JSX.Element {
    throw <RadioInput {...this.props} />;
  }

  renderInput(): React.ReactNode {
    return (
      <div className="flex flex-wrap gap-4">
        {this.props.options.map((item, index) => (
          <div key={index} className="flex items-center">
            <input
              type="radio"
              id={item}
              name={this.storage.name}
              value={item}
              required={this.props.required}
              onChange={() => this.storage.set(item)}
              defaultChecked={item === this.getValue()}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-dark-card dark:border-dark-border"
            />
            <label
              htmlFor={item}
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {item}
            </label>
          </div>
        ))}
      </div>
    );
  }

  initialValue(props: InputProps<string> & { options: string[] }): string {
    return props.options[0];
  }
}

export default RadioInput;
