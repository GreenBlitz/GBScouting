import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";
import "../../components/reefScore.css";
import coralSVG from "../../assets/low-coral.svg";
import algeaSVG from "../../assets/low-algea.svg";
import ReefInput from "./ReefInput";
import { StorageBacked } from "../../utils/FolderStorage";
import { UsedAlgea } from "../../utils/SeasonUI";

interface CollectedObject {
  coralFeeder: boolean;
  coralGround: boolean;
  algeaGround: boolean;
}

export interface PickValues {
  algea: UsedAlgea;
  collected: CollectedObject;
}
type AlgeaAction = keyof UsedAlgea;
type CollectionAction = keyof CollectedObject;
type Action = AlgeaAction | CollectionAction;

class ReefPickInput extends ScouterInput<
  PickValues,
  { reefInput: ReefInput },
  {
    objectives: PickValues;
  }
> {
  private readonly undoStack: StorageBacked<Action[]>;

  constructor(props: InputProps<PickValues> & { reefInput: ReefInput }) {
    super(props);
    this.undoStack = this.storage.subItem<Action[]>("/undoStack");
  }

  create(): React.JSX.Element {
    return <ReefPickInput {...this.props} />;
  }

  initialValue(props: InputProps<PickValues>): PickValues {
    return {
      algea: {
        netScore: 0,
        netMiss: 0,
        processor: 0,
      },
      collected: { coralFeeder: false, coralGround: false, algeaGround: false },
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

  addAction(action: AlgeaAction) {
    this.state.objectives.algea[action]++;
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
      if (lastAction in this.state.objectives.algea) {
        this.state.objectives.algea[lastAction as AlgeaAction]--;
      } else if (lastAction in this.state.objectives.collected) {
        this.state.objectives.collected[lastAction as CollectionAction] =
          !this.state.objectives.collected[lastAction as CollectionAction];
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
          this.state.objectives.collected.coralFeeder
            ? "button-green"
            : "button-red"
        } big-button ml-0`}
        onClick={() => this.updateCollection("coralFeeder")}
      >
        <h2 className="absolute mb-16 text-2xl font-extrabold">Feeder</h2>
        <img className="mt-2" src={coralSVG} width={80} alt="Coral Icon" />
      </button>
    );

    const coralGroundButton = (
      <button
        className={`${
          this.state.objectives.collected.coralGround
            ? "button-green"
            : "button-red"
        } big-button ml-0`}
        onClick={() => this.updateCollection("coralGround")}
      >
        <h2 className="absolute mb-16 text-2xl font-extrabold">Ground</h2>
        <img className="mt-2" src={coralSVG} width={80} alt="Coral Icon" />
      </button>
    );

    const algeaGroundButton = (
      <button
        className={`${
          this.state.objectives.collected.algeaGround
            ? "button-green"
            : "button-red"
        } big-button ml-0`}
        onClick={() => this.updateCollection("algeaGround")}
      >
        <h2 className="absolute mb-16 text-2xl font-extrabold">Ground</h2>
        <img className="mt-6" src={algeaSVG} width={60} alt="Algea Icon" />
      </button>
    );

    const processorButton = (
      <button
        className="buttonS ml-4 mr-2 items-center flex flex-col justify-center mb-4"
        onClick={() => this.addAction("processor")}
      >
        <h2 className="text-3xl font-extrabold">PRO.</h2>
        {this.state.objectives.algea.processor}
      </button>
    );

    const netMissButton = (
      <button className="buttonF" onClick={() => this.addAction("netMiss")}>
        {this.state.objectives.algea.netMiss}
      </button>
    );

    const netScoreButton = (
      <button
        className="buttonS mr-2 items-center flex flex-col justify-center"
        onClick={() => this.addAction("netScore")}
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

    return (
      <div className="flex items-center justify-center flex-col">
        <div className="flex flex-row justify-center">
          {netScoreButton}
          {netMissButton}
        </div>
        {processorButton}

        {this.props.reefInput.create()}
        <div className="flex flex-row justify-center">
          {coralFeederButton}
          {coralGroundButton}
        </div>
        {algeaGroundButton}
        {undoButton}
      </div>
    );
  }
}

export default ReefPickInput;
