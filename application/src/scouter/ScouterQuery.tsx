import React from "react";
import { queryFolder } from "../utils/FolderStorage";

export interface QueryProps<T> {
  name: string;
  required?: boolean | undefined;
  defaultValue?: T;
}

abstract class ScouterQuery<
  T,
  State extends {} = {},
  Props extends {} = {}
> extends React.Component<QueryProps<T> & Props, State> {
  constructor(props: QueryProps<T> & Props) {
    super(props);

    if (!queryFolder.getItem(props.name)) {
      queryFolder.setItem(
        props.name,
        (this.props.defaultValue || this.getInitialValue(props)) + ""
      );
    }
    this.state = this.getStartingState(props);
  }

  render(): React.ReactNode {
    return (
      <div className="scouter-query">
        <h2>{this.props.name}</h2>
        {this.renderInput()}
      </div>
    );
  }

  abstract getStartingState(props: QueryProps<T> & Props): State;
  abstract renderInput(): React.ReactNode;
  abstract getInitialValue(props: QueryProps<T> & Props): T;
}

export default ScouterQuery;
