import React from "react";
import ScouterQuery from "../ScouterQuery";
import { Color } from "../../utils/Color";

class CounterQuery extends ScouterQuery<
  number,
  { color?: Color },
  {}
> {
  Instantiate(): React.JSX.Element {
    return <CounterQuery {...this.props} />
  }
  getInitialValue(): number {
    return 0;
  }

  renderInput(): React.ReactNode {
    const setCount = (newCount: number) => {
      this.storage.set(newCount);
    };

    const getCurrentCount = () => {
      return this.storage.get() || 0;
    }

    return (
      <>
        <button
          type="button"
          onClick={() => setCount(Math.max(getCurrentCount() - 1, 0))}
          style={{ backgroundColor: this.props.color }}
        >
          -
        </button>
        <h3>{getCurrentCount()}</h3>
        <input
          type="hidden"
          id={this.storage.name}
          name={this.storage.name}
          value={getCurrentCount()}
        />
        <button
          type="button"
          onClick={() => setCount(getCurrentCount() + 1)}
          style={{ backgroundColor: this.props.color }}
        >
          +
        </button>
      </>
    );
  }
}

export default CounterQuery;
