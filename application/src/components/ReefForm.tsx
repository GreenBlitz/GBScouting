import React from "react";
import ScouterInput from "../scouter/ScouterInput";
import { InputProps } from "../scouter/ScouterInput";
import "./reefScore.css";

interface Level {
  score: number;
  miss: number;
}

interface Levels {
  L1: Level;
  L2: Level;
  L3: Level;
  L4: Level;
}

class ReefScoring extends ScouterInput<
  Levels,
  {},
  { levels: Levels; undoStack: { level: keyof Levels; point: keyof Level }[] }
> {
  create(): React.JSX.Element {
    return <ReefScoring {...this.props} />;
  }

  initialValue(): Levels {
    return {
      L1: { score: 0, miss: 0 },
      L2: { score: 0, miss: 0 },
      L3: { score: 0, miss: 0 },
      L4: { score: 0, miss: 0 },
    };
  }

  getStartingState(props: InputProps<Levels>): {
    levels: Levels;
    undoStack: { level: keyof Levels; point: keyof Level }[];
  } {
    return {
      levels: this.initialValue(),
      undoStack: [],
    };
  }

  renderInput(): React.ReactNode {
    const handleClick = (level: keyof Levels, point: keyof Level) => {
      const updatedLevels = { ...this.state.levels };
      updatedLevels[level][point] += 1;
      this.setState({ undoStack: [...this.state.undoStack, { level, point }] });
      this.storage.set(this.state.levels);
    };

    const handleUndo = () => {
      if (this.state.undoStack.length === 0) return;

      const lastAction = this.state.undoStack[this.state.undoStack.length - 1];
      const updatedLevels = { ...this.state.levels };
      updatedLevels[lastAction.level][lastAction.point] -= 1;

      this.setState({
        levels: updatedLevels,
        undoStack: this.state.undoStack.slice(0, -1),
      });

      this.storage.set(this.state.levels);
    };

    return (
      <div>
        {Object.keys(this.state.levels).map((levelKey) => {
          const level = levelKey as keyof Levels;
          return (
            <div key={level}>
                <h2 className="inline-block">{level}</h2>
              <button
                className="buttonS"
                onClick={() => handleClick(level, "score")}
              >
                {this.state.levels[level].score}
              </button>
              <button
                className="buttonF"
                onClick={() => handleClick(level, "miss")}
              >
                {this.state.levels[level].miss}
              </button>
            </div>
          );
        })}
        <button
          className="bg-purple-700 text-white py-2 px-4 rounded"
          onClick={handleUndo}
        >
          Undo
        </button>
      </div>
    );
  }
}

export default ReefScoring;