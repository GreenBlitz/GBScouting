import React from "react";
import { QueryStorable } from "../utils/FolderStorage";

export interface QueryProps<T> {
  name: string;
  isNameHidden?: boolean;
  required?: boolean | undefined;
  defaultValue?: T;
}

abstract class ScouterQuery<
  T,
  Props extends {} = {},
  State extends {} = {}
> extends React.Component<QueryProps<T> & Props, State> {
  public readonly storage: QueryStorable<T>;
  constructor(props: QueryProps<T> & Props) {
    super(props);
    this.storage = new QueryStorable<T>(this.props.name);
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
      <div className="scouter-query">
        {!this.props.isNameHidden && <h2>{this.props.name}</h2>}
        {this.renderInput()}
      </div>
    );
  }

  getStartingState(props: QueryProps<T> & Props): State | undefined {
    return undefined;
  }

  abstract renderInput(): React.ReactNode;
  abstract getInitialValue(props: QueryProps<T> & Props): T;
  abstract Instantiate(): React.JSX.Element;
}

export default ScouterQuery;
