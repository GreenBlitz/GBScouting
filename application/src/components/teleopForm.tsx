import React from "react";
import ScouterInput from "../scouter/ScouterInput";
import { InputProps } from "../scouter/ScouterInput";
import "./reefScore.css";
import algeaSVG from "../assets/low-algea.svg";
import branchLeftSVG from "../assets/branch-left.svg";
import branchRightSVG from "../assets/branch-right.svg";

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
}

interface NetAction {
  type: keyof Level;
}

type FullAction = NetAction | CoralAction;

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
    };
  }

  getStartingState(props: InputProps<AllScore>): {
    values: AllScore;
    undoStack: FullAction[];
  } {
    return {
      values: this.getValue(),
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

    const handleUndo = () => {
      if (this.state.undoStack.length === 0) {
        return;
      }

      const lastAction = this.state.undoStack[this.state.undoStack.length - 1];
      const updatedValues = { ...this.state.values };

      if ("level" in lastAction) {
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
                className="buttonS mr-2 items-center flex flex-col justify-center"
                onClick={() => handleClick({ level: level, point: "score" })}
              >
                <h2 className="text-3xl font-extrabold">{level}</h2>
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

        <div className="flex mb-10 mt-5">
          <button
            className="bg-green-400 w-20 h-20 text-white py-2 px-4 rounded mr-2.5 relative"
            onClick={() => handleNet({ type: "score" })}
          >
            <img src={algeaSVG} width={80} alt="Algea Icon" />
            <span className="absolute inset-0 flex items-center justify-center text-2xl text-black font-bold">
              {this.state.values.net.score}
            </span>
          </button>
          <button
            className="bg-red-400 w-20 h-20 text-white py-2 px-4 rounded ml-2.5 relative"
            onClick={() => handleNet({ type: "miss" })}
          >
            <img src={algeaSVG} width={80} alt="Algea Icon" />
            <span className="absolute inset-0 flex items-center justify-center text-2xl text-black font-bold">
              {this.state.values.net.miss}
            </span>
          </button>
        </div>

        <div className="flex">
          <button
            className="bg-[#596c86] w-48 h-20 text-white py-2 px-4 rounded"
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
