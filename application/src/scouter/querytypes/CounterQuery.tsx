import React from "react";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { queryFolder } from "../../utils/FolderStorage";
import ScouterQuery, { QueryProps } from "../ScouterQuery";

class CounterQuery extends ScouterQuery<
  number,
  { count: number },
  { color?: string }
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

    const buttonBaseClass = `w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-lg
      hover:opacity-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg`;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-6"
      >
        <button
          type="button"
          onClick={() => setCount(Math.max(this.state.count - 1, 0))}
          style={{ backgroundColor: this.props.color }}
          className={`${buttonBaseClass} text-2xl`}
        >
          <Minus className="w-6 h-6" />
        </button>
        <motion.div
          key={this.state.count}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="w-16 text-center"
        >
          <span className="text-4xl font-bold text-dark-text">
            {this.state.count}
          </span>
          <input
            type="hidden"
            id={this.props.name}
            name={this.props.name}
            value={this.state.count}
          />
        </motion.div>
        <button
          type="button"
          onClick={() => setCount(this.state.count + 1)}
          style={{ backgroundColor: this.props.color }}
          className={`${buttonBaseClass} text-2xl`}
        >
          <Plus className="w-6 h-6" />
        </button>
      </motion.div>
    );
  }
}

export default CounterQuery;
