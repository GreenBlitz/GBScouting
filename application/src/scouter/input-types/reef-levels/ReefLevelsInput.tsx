import React from "react";
import ScouterInput from "../../ScouterInput";
import { InputProps } from "../../ScouterInput";
import algeaSVG from "../../../assets/low-algea.svg";
import ReefInput, { ReefSide } from "../ReefInput";
import { StorageBacked } from "../../../utils/FolderStorage";
import "./reefScore.css";

export interface Level {
  score: number;
  miss: number;
}

export interface Levels {
  L1: Level;
  L2: Level;
  L3: Level;
  L4: Level;
}

export interface AlgeaCollection {
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

interface AlgeaAction {
  isCollected: boolean;
}

type Action = CoralAction | AlgeaAction;

export const areReefsSame = (side1: ReefSide, side2: ReefSide) =>
  side1.proximity === side2.proximity && side1.side === side2.side;

class ReefLevelsInput extends ScouterInput<
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
    return <ReefLevelsInput {...this.props} />;
  }

  clearValue(): void {
    super.clearValue();
    this.undoStack.remove();
  }

  initialValue(): AllScore {
    return {
      L1: { score: 0, miss: 0 },
      L2: { score: 0, miss: 0 },
      L3: { score: 0, miss: 0 },
      L4: { score: 0, miss: 0 },
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

      this.undoStack.set([
        ...(this.undoStack.get() || []),
        { level: action.level, point: action.point },
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
      } else if ("isCollected" in lastAction) {
        const previousValue = lastAction.isCollected
          ? updatedValues.algea.collected
          : updatedValues.algea.dropped;
        lastAction.isCollected
          ? (updatedValues.algea.collected = !previousValue)
          : (updatedValues.algea.dropped = !previousValue);
      }

      const updatedStack = undoStack.slice(0, -1);

      this.undoStack.set(updatedStack);
      this.setState({
        values: updatedValues,
      });

      this.storage.set({
        ...updatedValues,
      });
    };

    const levelelements = levelKeys.map((levelKey) => {
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
    });

    const algeaReef = (
      <div className="flex mb-5">
        <button
          className={`${
            this.state.values.algea.collected ? "button-green" : "button-red"
          } big-button ml-0`}
          onClick={() => handleAlgea({ isCollected: true })}
        >
          <h2 className="absolute mb-16 text-2xl font-extrabold">Collected</h2>
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
    );

    return (
      <div className="flex flex-col items-center">
        {levelelements}
        {algeaReef}
        <div className="flex">
          <button
            className="undo-color w-48 h-10 text-white py-2 px-4 rounded"
            onClick={handleUndo}
          >
            Undo
          </button>
        </div>
      </div>
    );
  }
}

export default ReefLevelsInput;
