import React from "react";
import ScouterInput from "../scouter/ScouterInput";
import { InputProps } from "../scouter/ScouterInput";
import "./reefScore.css";
import algeaSVG from "../assets/low-algea.svg";
import ReefInput, { ReefSide } from "../scouter/input-types/ReefInput";

export interface Level {
  score: number;
  miss: number;
  sides: ReefSide[];
}

export interface Levels {
  L1: Level;
  L2: Level;
  L3: Level;
  L4: Level;
}

interface AlgeaCollection {
  collected: boolean;
  dropped: boolean;
}

export interface AllScore extends Levels {
  algea: AlgeaCollection;
}

interface CoralAction {
  level: keyof Levels;
  point: "score" | "miss";
}

type FullCoralAction = CoralAction & { side: ReefSide };

interface AlgeaAction {
  isCollected: boolean;
}

type Action = FullCoralAction | AlgeaAction;

export const areReefsSame = (side1: ReefSide, side2: ReefSide) =>
  side1.proximity === side2.proximity && side1.side === side2.side;

class TeleopForm extends ScouterInput<
  AllScore,
  { reefInput: ReefInput },
  {
    values: AllScore;
    undoStack: Action[];
  }
> {
  create(): React.JSX.Element {
    return <TeleopForm {...this.props} />;
  }

  initialValue(): AllScore {
    return {
      L1: { score: 0, miss: 0, sides: [] },
      L2: { score: 0, miss: 0, sides: [] },
      L3: { score: 0, miss: 0, sides: [] },
      L4: { score: 0, miss: 0, sides: [] },
      algea: { collected: false, dropped: false },
    };
  }

  getStartingState(props: InputProps<AllScore>): {
    values: AllScore;
    undoStack: Action[];
  } {
    return {
      values: this.getValue(),
      undoStack: [],
    };
  }

  renderInput(): React.ReactNode {
    const levelKeys: (keyof Levels)[] = ["L4", "L3", "L2", "L1"];

    const handleCoral = (action: CoralAction) => {
      const updatedValues = { ...this.state.values };
      updatedValues[action.level][action.point] += 1;

      const currentReefSide = this.props.reefInput.getValue();
      if (
        !updatedValues[action.level].sides.find((value) =>
          areReefsSame(value, currentReefSide)
        )
      ) {
        updatedValues[action.level].sides.push(currentReefSide);
      }

      this.setState({
        undoStack: [
          ...this.state.undoStack,
          { level: action.level, point: action.point, side: currentReefSide },
        ],
        values: updatedValues,
      });
      this.storage.set({
        ...updatedValues,
      });
    };

    const handleAlgea = (action: AlgeaAction) => {
      const updatedValues = { ...this.state.values };
      if (action.isCollected) {
        updatedValues.algea.collected = !updatedValues.algea.collected;
      } else {
        updatedValues.algea.dropped = !updatedValues.algea.dropped;
      }

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
        updatedValues[lastAction.level].sides = updatedValues[
          lastAction.level
        ].sides.filter((side) => !areReefsSame(side, lastAction.side));
      } else {
        const previousValue = lastAction.isCollected
          ? updatedValues.algea.collected
          : updatedValues.algea.dropped;
        lastAction.isCollected
          ? (updatedValues.algea.collected = !previousValue)
          : (updatedValues.algea.dropped = !previousValue);
      }

      const updatedStack = this.state.undoStack.slice(0, -1);
      updatedStack.forEach((action) => {
        if ("isCollected" in action) {
          return;
        }
        if (
          !updatedValues[action.level].sides.find((value) =>
            areReefsSame(value, action.side)
          )
        ) {
          updatedValues[action.level].sides.push(action.side);
        }
      });

      this.setState({
        undoStack: updatedStack,
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
                onClick={() => handleCoral({ level: level, point: "score" })}
              >
                <h2 className="text-3xl font-extrabold">{level}</h2>
                {this.state.values[level].score}
              </button>
              <button
                className="buttonF"
                onClick={() => handleCoral({ level: level, point: "miss" })}
              >
                {this.state.values[level].miss}
              </button>
            </div>
          );
        })}

        <div className="flex mb-10 mt-5">
          <button
            className={`${
              this.state.values.algea.collected ? "button-green" : "button-red"
            } big-button ml-0`}
            onClick={() => handleAlgea({ isCollected: true })}
          >
            <h2 className="absolute mb-16 text-2xl font-extrabold">
              Collected
            </h2>
            <img className="mt-6" src={algeaSVG} width={60} alt="Algea Icon" />
          </button>
          <button
            className={`${
              this.state.values.algea.dropped ? "button-green" : "button-red"
            } big-button ml-0`}
            onClick={() => handleAlgea({ isCollected: false })}
          >
            <h2 className="absolute mb-16 text-2xl font-extrabold">Dropped</h2>
            <img className="mt-6" src={algeaSVG} width={60} alt="Algea Icon" />
          </button>
        </div>

        <div className="flex">
          <button
            className="undo-color w-48 h-20 text-white py-2 px-4 rounded"
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
