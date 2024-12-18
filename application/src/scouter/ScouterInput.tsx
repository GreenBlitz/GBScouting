import React from "react";
import { InputStorable } from "../utils/FolderStorage";

export interface InputProps<T> {
  name: string;
  isNameHidden?: boolean;
  required?: boolean;
  defaultValue?: T;
  doesReset?: boolean;
}

abstract class ScouterInput<T, Props = {}, State = {}> extends React.Component<
  InputProps<T> & Props,
  State
> {
  public readonly storage: InputStorable<T>;
  constructor(props: InputProps<T> & Props) {
    super(props);
    this.storage = new InputStorable<T>(this.props.name);
    const startingState = this.getStartingState(props);
    if (startingState) {
      this.state = startingState;
    }
  }

  render(): React.ReactNode {
    if (!this.storage.exists()) {
      this.storage.set(
        this.defaultValue()
      );
    }
    return (
      <div className="scouter-input">
        {!this.props.isNameHidden && <h2>{this.props.name}</h2>}
        {this.renderInput()}
      </div>
    );
  }

  getStartingState(props: InputProps<T> & Props): State | undefined {
    return undefined;
  }

  shouldReset(): boolean {
    return !!this.props.doesReset;
  }

  defaultValue(): T {
    return this.props.defaultValue || this.initialValue(this.props);
  }

  getValue(): T {
    return this.storage.get() || this.defaultValue();
  }

  abstract renderInput(): React.ReactNode;
  abstract create(): React.JSX.Element;
  protected abstract initialValue(props: InputProps<T> & Props): T;
}

export default ScouterInput;
