import React from "react";
import { queryFolder, QueryStorable } from "../utils/FolderStorage";

export interface QueryProps<T> {
  storage: QueryStorable<T>;
  required?: boolean | undefined;
  defaultValue?: T;
}

abstract class ScouterQuery<
  T,
  Props extends {} = {},
  State extends {} = {}
> extends React.Component<QueryProps<T> & Props, State> {
  constructor(props: QueryProps<T> & Props) {
    super(props);

    if (!props.storage.exists()) {
      props.storage.set(this.props.defaultValue || this.getInitialValue(props))
    }
    const startingState = this.getStartingState(props);
    if (startingState) {
      this.state = startingState;
    }
  }

  render(): React.ReactNode {
    return (
      <div className="scouter-query">
        <h2>{this.props.storage.name}</h2>
        {this.renderInput()}
      </div>
    );
  }

  getStartingState(props: QueryProps<T> & Props): State | undefined {
    return undefined;
  }
  abstract renderInput(): React.ReactNode;
  abstract getInitialValue(props: QueryProps<T> & Props): T;
}

export default ScouterQuery;
