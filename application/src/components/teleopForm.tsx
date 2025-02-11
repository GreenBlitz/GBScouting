import React from "react";
import ScouterInput from "../scouter/ScouterInput";
import { InputProps } from "../scouter/ScouterInput";
import "./reefScore.css";
import algeaSVG from "../assets/low-algea.svg";
import ReefInput, {
  ReefSide,
  triangleButtonMiddles,
} from "../scouter/input-types/ReefInput";
import { StorageBacked } from "../utils/FolderStorage";
import ScouterInputs from "../scouter/ScouterInputs";

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
  }
> {
  private readonly undoStack: StorageBacked<Action[]>;

  constructor(props: InputProps<AllScore> & { reefInput: ReefInput }) {
    super(props);
    this.undoStack = this.storage.subItem("/undoStack");
  }

  create(): React.JSX.Element {
    return <TeleopForm {...this.props} />;
  }

  clearValue(): void {
    super.clearValue();
    this.undoStack.remove();
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
  } {
    return {
      values: this.getValue(),
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

      this.undoStack.set([
        ...(this.undoStack.get() || []),
        { level: action.level, point: action.point, side: currentReefSide },
      ]);
      this.setState({
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

      this.undoStack.set([...(this.undoStack.get() || []), action]);
      this.setState({
        values: updatedValues,
      });
      this.storage.set({
        ...updatedValues,
      });
    };

    const handleUndo = () => {
      const undoStack = this.undoStack.get() || [];
      if (undoStack.length === 0) {
        return;
      }

      const lastAction = undoStack[undoStack.length - 1];
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

      const updatedStack = undoStack.slice(0, -1);
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

      this.undoStack.set(updatedStack);
      this.setState({
        values: updatedValues,
      });

      this.storage.set({
        ...updatedValues,
      });
    };

    const isBlue = ScouterInputs.gameSide.getValue() === "Blue";
    const correctSide = isBlue
      ? this.props.reefInput.getValue()
      : this.props.reefInput.getOppositeSide(this.props.reefInput.getValue());

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

        <h1 className="text-2xl font-bold">
          Side{" "}
          {
            (
              triangleButtonMiddles.find((value) =>
                areReefsSame(value.reefSide, correctSide)
              ) || triangleButtonMiddles[0]
            ).name
          }
        </h1>

        <div className="flex mb-10">
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
