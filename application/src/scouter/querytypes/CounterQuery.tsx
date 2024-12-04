import React from "react";
import { queryFolder } from "../../utils/FolderStorage";
import ScouterQuery, { QueryProps } from "../ScouterQuery";

class CounterQuery extends ScouterQuery<
  number,
  { color?: string },
  { count: number }
> {
  getStartingState(props: QueryProps<number>) {
    const savedValue = queryFolder.getItem(props.name);
    let initialValue: number = props.defaultValue || 0;
    if (savedValue) {
      initialValue = parseInt(savedValue);
    }
    return { count: initialValue };
  }

  getInitialValue(): number {
    return 0;
  }

  renderInput(): React.ReactNode {
    const setCount = (newCount: number) => {
      queryFolder.setItem(this.props.name, newCount + "");
      this.setState({ count: newCount });
    };

    return (
      <>
        <button
          type="button"
          onClick={() => setCount(Math.max(this.state.count - 1, 0))}
          style={{ backgroundColor: this.props.color }}
        >
          -
        </button>
        <h3>{this.state.count}</h3>
        <input
          type="hidden"
          id={this.props.name}
          name={this.props.name}
          value={this.state.count}
        />
        <button
          type="button"
          onClick={() => setCount(this.state.count + 1)}
          style={{ backgroundColor: this.props.color }}
        >
          +
        </button>
      </>
    );
  }
}

export default CounterQuery;
