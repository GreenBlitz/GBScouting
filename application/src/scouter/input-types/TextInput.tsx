import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";
import { FaLock, FaUnlock } from "react-icons/fa";

class TextInput extends ScouterInput<
  string,
  { isLockable?: boolean },
  { isLocked: boolean }
> {
  create(): React.JSX.Element {
    return <TextInput {...this.props} />;
  }

  initialValue(): string {
    return "";
  }

  renderInput(): React.ReactNode {
    return (
      <>
        <input
          type="text"
          id={this.storage.name}
          name={this.storage.name}
          required={this.props.required}
          defaultValue={this.getValue().toString()}
          onChange={(event) => this.storage.set(event.target.value)}
          className={`w-full p-2 bg-dark-bg text-dark-text border border-dark-border rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            this.state.isLocked ? "opacity-50" : ""
          }`}
          disabled={this.state.isLocked}
        />
        {this.props.isLockable &&
          (this.state.isLocked ? (
            <button
              onClick={() => this.setState({ isLocked: false })}
              className="p-4 bg-red-400 ml-4"
            >
              <FaLock />
            </button>
          ) : (
            <button
              onClick={() => this.setState({ isLocked: true })}
              className="p-4 bg-green-300 ml-4"
            >
              <FaUnlock />
            </button>
          ))}
      </>
    );
  }

  getStartingState(
    props: InputProps<string> & { isLockable: boolean | undefined }
  ): { isLocked: boolean } | undefined {
    return { isLocked: this.getValue() !== "" };
  }
}

export default TextInput;
