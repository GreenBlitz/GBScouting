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

export interface AllScore extends Levels {
  net: Level;
  proccessor: number;
}

interface NetAction {
  type: keyof Level;
}

type ProccessorAction = "proccessor";

type FullAction = NetAction | CoralAction | ProccessorAction;

interface CoralAction {
  level: keyof Levels;
  point: keyof Level;
}

class TeleopForm extends ScouterInput<
  AllScore,
  {},
  {
    values: AllScore;
    undoStack: FullAction[];
  }
> {
  create(): React.JSX.Element {
    return <TeleopForm {...this.props} />;
  }

  initialValue(): AllScore {
    return {
      L1: { score: 0, miss: 0 },
      L2: { score: 0, miss: 0 },
      L3: { score: 0, miss: 0 },
      L4: { score: 0, miss: 0 },
      net: { score: 0, miss: 0 },
      proccessor: 0,
    };
  }

  getStartingState(props: InputProps<AllScore>): {
    values: AllScore;
    undoStack: FullAction[];
  } {
    return {
      values: this.initialValue(),
      undoStack: [],
    };
  }

  renderInput(): React.ReactNode {
    const levelKeys: (keyof Levels)[] = ["L4", "L3", "L2", "L1"];

    const handleClick = (action: CoralAction) => {
      const updatedValues = { ...this.state.values };
      updatedValues[action.level][action.point] += 1;
      this.setState({
        undoStack: [
          ...this.state.undoStack,
          { level: action.level, point: action.point },
        ],
        values: updatedValues,
      });
      this.storage.set({
        ...updatedValues,
      });
    };

    const handleNet = (action: NetAction) => {
      const updatedValues = { ...this.state.values };
      updatedValues["net"][action.type]++;
      this.setState({
        undoStack: [...this.state.undoStack, action],
        values: updatedValues,
      });
      this.storage.set({
        ...updatedValues,
      });
    };

    const handleAlgea = (action: ProccessorAction) => {
      const updatedValues = { ...this.state.values };
      updatedValues[action]++;
      this.setState({
        undoStack: [...this.state.undoStack, action],
        values: updatedValues,
      });
      this.storage.set({
        ...updatedValues,
      });
    };

    const handleUndo = () => {
      if (this.state.undoStack.length === 0) return;

      const lastAction = this.state.undoStack[this.state.undoStack.length - 1];
      const updatedValues = { ...this.state.values };

      if ("proccessor" === lastAction) {
        updatedValues["proccessor"]--;
      } else if ("level" in lastAction) {
        updatedValues[lastAction.level][lastAction.point]--;
      } else if ("type" in lastAction) {
        updatedValues["net"][lastAction.type]--;
      }

      this.setState({
        undoStack: this.state.undoStack.slice(0, -1),
        values: updatedValues,
      });

      this.storage.set({
        ...updatedValues,
      });
    };

    return (
      <div className="flex flex-col items-center">
        {levelKeys.map((levelKey) => {
          const level = levelKey as keyof Levels;
          return (
            <div className="flex" key={level}>
              <button
                className="buttonS mr-2"
                onClick={() => handleClick({ level: level, point: "score" })}
              >
                <h2 
                  className={`mr-${
                    level === "L1" ? 8 : 7
                  } text-3xl justify-center font-bold flex items-center`}
                >
                  {level}
                </h2>
                {this.state.values[level].score}
              </button>
              <button
                className="buttonF"
                onClick={() => handleClick({ level: level, point: "miss" })}
              >
                {this.state.values[level].miss}
              </button>
            </div>
          );
        })}

        <div className="h-16" />
        <div className="flex">
          <button
            className="buttonS bg-cyan-400"
            onClick={() => handleNet({ type: "score" })}
          >
            {this.state.values.net.score}
          </button>
          <button
            className="buttonF bg-orange-700"
            onClick={() => handleNet({ type: "miss" })}
          >
            {this.state.values.net.miss}
          </button>
          <button
            className="buttonS ml-5 "
            onClick={() => handleAlgea("proccessor")}
          >
            {this.state.values.proccessor}
          </button>
        </div>

        <div className="ml-12 flex">
          <button
            className="bg-purple-700 w-48 h-20 text-white py-2 px-4 rounded"
            onClick={handleUndo}
          >
            Undo
          </button>
        </div>
      </div>
    );
  }
}

export default TeleopForm;
