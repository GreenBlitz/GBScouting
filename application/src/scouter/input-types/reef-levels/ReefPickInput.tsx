import React from "react";
import ScouterInput, { InputProps } from "../../ScouterInput";
import "./reefScore.css";
import coralSVG from "../../../assets/low-coral.svg";
import algeaSVG from "../../../assets/low-algea.svg";
import { StorageBacked } from "../../../utils/FolderStorage";
import { Collection, UsedAlgea } from "../../../utils/SeasonUI";

export interface PickValues {
  algea: UsedAlgea;
  collected: Collection;
  levels: Levels;
}

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

interface CoralAction {
  level: keyof Levels;
  point: "score" | "miss";
}

type AlgeaAction = keyof UsedAlgea;

type CollectionAction = keyof Collection;
type Action = AlgeaAction | CollectionAction | CoralAction;

class ReefPickInput extends ScouterInput<
  PickValues,
  {},
  {
    objectives: PickValues;
  }
> {
  private readonly undoStack: StorageBacked<Action[]>;

  constructor(props: InputProps<PickValues>) {
    super(props);
    this.undoStack = this.storage.subItem<Action[]>("/undoStack");
  }

  create(): React.JSX.Element {
    return <ReefPickInput {...this.props} />;
  }

  clearValue(): void {
    super.clearValue();
    this.undoStack.remove();
  }

  initialValue(props: InputProps<PickValues>): PickValues {
    return {
      algea: {
        netScore: 0,
        netMiss: 0,
        processor: 0,
      },
      collected: {
        coralFeederCollected: false,
        coralGroundCollected: false,
        algeaGroundCollected: false,
        algeaReefCollected: false,
        algeaReefDropped: false,
      },
      levels: {
        L1: {
          score: 0,
          miss: 0,
        },
        L2: {
          score: 0,
          miss: 0,
        },
        L3: {
          score: 0,
          miss: 0,
        },
        L4: {
          score: 0,
          miss: 0,
        },
      },
    };
  }

  getStartingState(props: InputProps<PickValues>):
    | {
        objectives: PickValues;
      }
    | undefined {
    return {
      objectives: this.getValue(),
    };
  }

  addAlgeaAction(action: AlgeaAction) {
    this.state.objectives.algea[action]++;
    this.setState(this.state);
    this.storage.set(this.state.objectives);
    this.undoStack.set([...(this.undoStack.get() || []), action]);
  }

  addLevelAction(action: CoralAction) {
    this.state.objectives.levels[action.level][action.point]++;
    this.setState(this.state);
    this.storage.set(this.state.objectives);
    this.undoStack.set([...(this.undoStack.get() || []), action]);
  }

  updateCollection(action: CollectionAction) {
    this.state.objectives.collected[action] =
      !this.state.objectives.collected[action];
    this.setState(this.state);
    this.storage.set(this.state.objectives);
    this.undoStack.set([...(this.undoStack.get() || []), action]);
  }

  undo() {
    const actions = this.undoStack.get() || [];
    if (actions.length > 0) {
      const lastAction = actions.pop();
      if (!lastAction) {
        return;
      }
      const coralAction = lastAction as CoralAction;
      const algeaAction = lastAction as AlgeaAction;
      const collectionAction = lastAction as CollectionAction;

      if (coralAction.level && coralAction.point) {
        this.state.objectives.levels[coralAction.level][coralAction.point]--;
      } else if (algeaAction in this.state.objectives.algea) {
        this.state.objectives.algea[algeaAction]--;
      } else if (collectionAction in this.state.objectives.collected) {
        this.state.objectives.collected[collectionAction] =
          !this.state.objectives.collected[collectionAction];
      }
      this.undoStack.set(actions);
    }
    this.setState(this.state);
    this.storage.set(this.state.objectives);
  }

  renderInput(): React.ReactNode {
    const coralFeederButton = (
      <button
        className={`${
          this.state.objectives.collected.coralFeederCollected
            ? "button-green"
            : "button-red"
        } big-button ml-0`}
        onClick={() => this.updateCollection("coralFeederCollected")}
      >
        <h2 className="absolute mb-16 text-2xl font-extrabold">Feeder</h2>
        <img className="mt-2" src={coralSVG} width={80} alt="Coral Icon" />
      </button>
    );

    const coralGroundButton = (
      <button
        className={`${
          this.state.objectives.collected.coralGroundCollected
            ? "button-green"
            : "button-red"
        } big-button ml-0`}
        onClick={() => this.updateCollection("coralGroundCollected")}
      >
        <h2 className="absolute mb-16 text-2xl font-extrabold">Ground</h2>
        <img className="mt-2" src={coralSVG} width={80} alt="Coral Icon" />
      </button>
    );

    const algeaGroundButton = (
      <button
        className={`${
          this.state.objectives.collected.algeaGroundCollected
            ? "button-green"
            : "button-red"
        } big-button mx-0`}
        onClick={() => this.updateCollection("algeaGroundCollected")}
      >
        <h2 className="absolute mb-16 text-2xl font-extrabold">Ground</h2>
        <img className="mt-6" src={algeaSVG} width={60} alt="Algea Icon" />
      </button>
    );

    const processorButton = (
      <button
        className="buttonS ml-4 mr-2 items-center flex flex-col justify-center mb-4"
        onClick={() => this.addAlgeaAction("processor")}
      >
        <h2 className="text-3xl font-extrabold">PRO.</h2>
        {this.state.objectives.algea.processor}
      </button>
    );

    const netMissButton = (
      <button
        className="buttonF"
        onClick={() => this.addAlgeaAction("netMiss")}
      >
        {this.state.objectives.algea.netMiss}
      </button>
    );

    const netScoreButton = (
      <button
        className="buttonS mr-2 items-center flex flex-col justify-center"
        onClick={() => this.addAlgeaAction("netScore")}
      >
        <h2 className="text-3xl font-extrabold">NET</h2>
        {this.state.objectives.algea.netScore}
      </button>
    );
    const undoButton = (
      <button
        onClick={() => this.undo()}
        className="undo-color w-48 h-16 text-white py-2 px-4 rounded mt-4"
      >
        Undo
      </button>
    );

    const levelKeys: (keyof Levels)[] = ["L4", "L3", "L2", "L1"];

    const levelelements = levelKeys.map((levelKey) => {
      const level = levelKey as keyof Levels;
      return (
        <div className="flex my-2" key={level}>
          <button
            className="buttonS mr-2 items-center flex flex-col justify-center"
            onClick={() =>
              this.addLevelAction({ level: level, point: "score" })
            }
          >
            <h2 className="text-3xl font-extrabold">{level}</h2>
            {this.state.objectives.levels[level].score}
          </button>
          <button
            className="buttonF"
            onClick={() => this.addLevelAction({ level: level, point: "miss" })}
          >
            {this.state.objectives.levels[level].miss}
          </button>
        </div>
      );
    });

    const algeaCollectedButton = (
      <button
        className={`${
          this.state.objectives.collected.algeaReefCollected
            ? "button-green"
            : "button-red"
        } big-button ml-0`}
        onClick={() => this.updateCollection("algeaReefCollected")}
      >
        <h2 className="absolute mb-16 text-2xl font-extrabold">Collected</h2>
        <img className="mt-6" src={algeaSVG} width={60} alt="Algea Icon" />
      </button>
    );

    const algeaDroppedButton = (
      <button
        className={`${
          this.state.objectives.collected.algeaReefDropped
            ? "button-green"
            : "button-red"
        } big-button ml-0`}
        onClick={() => this.updateCollection("algeaReefDropped")}
      >
        <h2 className="absolute mb-16 text-2xl font-extrabold">Dropped</h2>
        <img className="mt-6" src={algeaSVG} width={60} alt="Algea Icon" />
      </button>
    );

    return (
      <div className="flex items-center justify-center flex-col">
        <div className="flex flex-row justify-center">
          {netScoreButton}
          {netMissButton}
          {processorButton}
        </div>

        <div className="flex flex-row justify-center">
          <div className="flex flex-col justify-center mr-5">
            {levelelements}
          </div>
          <div className="flex flex-col ml-5">
            {coralFeederButton}
            {coralGroundButton}
            {algeaGroundButton}
            {algeaCollectedButton}
            {algeaDroppedButton}
          </div>
        </div>
        {undoButton}
      </div>
    );
  }
}

export default ReefPickInput;
