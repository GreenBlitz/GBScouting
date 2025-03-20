import React from "react";
import { StorageBackedInput } from "../utils/FolderStorage";

export interface InputProps<T> {
  route: string;
  name?: string;
  required?: boolean;
  defaultValue?: T;
  doesRemain?: boolean;
}

abstract class ScouterInput<T, Props = {}, State = {}> extends React.Component<
  InputProps<T> & Props,
  State
> {
  public readonly storage: StorageBackedInput<T>;
  constructor(props: InputProps<T> & Props) {
    super(props);
    this.storage = new StorageBackedInput<T>(this.props.route);

    const startingState = this.getStartingState(props);
    if (startingState) {
      this.state = startingState;
    }
  }

  render(): React.ReactNode {
    if (!this.storage.exists()) {
      this.storage.set(this.defaultValue());
    }
    return (
      <div className="p-4 space-y-2">
        <div className="flex flex-row items-center justify-center" style={{display: "flex", flexDirection: "column"}}>
          {this.props.name && (
            <h1 className="text-lg font-semibold text-dark-text mr-2 whitespace-nowrap">
              {this.props.name}
            </h1>
          )}
          {this.renderInput()}
        </div>
        {this.renderBelow()}
      </div>
    );
  }

  getStartingState(props: InputProps<T> & Props): State | undefined {
    return undefined;
  }

  shouldReset(): boolean {
    return !this.props.doesRemain;
  }

  defaultValue(): T {
    return this.props.defaultValue || this.initialValue(this.props);
  }

  getValue(): T {
    return this.storage.get() || this.defaultValue();
  }

  clearValue() {
    this.storage.remove();
  }

  abstract create(): React.JSX.Element;
  abstract renderInput(): React.ReactNode;
  renderBelow(): React.ReactNode {
    return <></>;
  }
  abstract initialValue(props: InputProps<T> & Props): T;
}

export default ScouterInput;
