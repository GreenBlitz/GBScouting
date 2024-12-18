import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";
import { Color } from "../../utils/Color";

class CounterInput extends ScouterInput<
  number,
  { color?: Color },
  { count: number }
> {
  getStartingState(
    props: InputProps<number> & { color?: Color }
  ): { count: number } | undefined {
    return { count: this.storage.get() || 0 };
  }
  create(): React.JSX.Element {
    return <CounterInput {...this.props} />;
  }
  initialValue(): number {
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
          style={{ backgroundColor: this.props.color?.toString() }}
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
          style={{ backgroundColor: this.props.color?.toString() }}
        >
          +
        </button>
      </>
    );
  }
}

export default CounterInput;
