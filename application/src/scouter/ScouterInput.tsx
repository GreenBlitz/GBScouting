import React from "react";
import { InputStorable } from "../utils/FolderStorage";

export interface InputProps<T> {
  name: string;
  isNameHidden?: boolean;
  required?: boolean | undefined;
  defaultValue?: T;
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
        this.props.defaultValue || this.getInitialValue(this.props)
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

  abstract renderInput(): React.ReactNode;
  abstract getInitialValue(props: InputProps<T> & Props): T;
  abstract instantiate(): React.JSX.Element;
}

export default ScouterInput;
