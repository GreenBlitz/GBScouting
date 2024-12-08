import React from "react";
import ScouterQuery, { QueryProps } from "../ScouterQuery";
import { Color } from "../../utils/Color";

class CounterQuery extends ScouterQuery<
  number,
  { color?: Color },
  { count: number }
> {
  getStartingState(props: QueryProps<number>) {
    const savedValue = props.storage.get();
    return { count: savedValue || 0 };
  }

  getInitialValue(): number {
    return 0;
  }

  renderInput(): React.ReactNode {
    const setCount = (newCount: number) => {
      this.props.storage.set(newCount);
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
          id={this.props.storage.name}
          name={this.props.storage.name}
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
