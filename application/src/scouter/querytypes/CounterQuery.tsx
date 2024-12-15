import React from "react";
import ScouterQuery, { QueryProps } from "../ScouterQuery";
import { Color } from "../../utils/Color";

class CounterQuery extends ScouterQuery<
  number,
  { color?: Color },
  { count: number }
> {
  getStartingState(
    props: QueryProps<number> & { color?: Color }
  ): { count: number } | undefined {
    return { count: this.storage.get() || 0 };
  }
  instantiate(): React.JSX.Element {
    return <CounterQuery {...this.props} />;
  }
  getInitialValue(): number {
    return 0;
  }

  renderInput(): React.ReactNode {
    const setCount = (newCount: number) => {
      this.storage.set(newCount);
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
          id={this.storage.name}
          name={this.storage.name}
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
