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
    return { count: this.getValue() };
  }
  create(): React.JSX.Element {
    return <CounterInput {...this.props} />;
  }
  initialValue(): number {
    return 0;
  }

  renderInput(): React.ReactNode {
    const setCount = (value: number) => {
      this.setState({ count: value });
      this.storage.set(value);
    };

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 p-2 bg-gray-100 dark:bg-dark-card rounded-lg">
          <button
            type="button"
            onClick={() => setCount(Math.max(this.state.count - 1, 0))}
            className="w-10 h-10 flex items-center justify-center text-xl font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
          >
            -
          </button>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {this.state.count}
          </span>
          <button
            type="button"
            onClick={() => setCount(this.state.count + 1)}
            className="w-10 h-10 flex items-center justify-center text-xl font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
          >
            +
          </button>
        </div>
        <input
          type="hidden"
          id={this.storage.name}
          name={this.storage.name}
          value={this.state.count}
        />
      </div>
    );
  }
}

export default CounterInput;
