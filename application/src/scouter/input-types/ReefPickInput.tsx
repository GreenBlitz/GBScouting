import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";
import "../../components/reefScore.css";
import coralSVG from "../../assets/low-coral.svg";
import algeaSVG from "../../assets/low-algea.svg";
import ReefInput from "./ReefInput";

type AlgeaAction = "netScore" | "netMiss" | "processor";
interface Collected {
  coralFeeder: boolean;
  coralGround: boolean;
  algeaGround: boolean;
}

interface PickValues {
  algea: AlgeaAction[];
  collected: Collected;
}

class ReefPickInput extends ScouterInput<
  PickValues,
  { reefInput: ReefInput },
  {
    objectives: PickValues;
  }
> {
  create(): React.JSX.Element {
    return <ReefPickInput {...this.props} />;
  }
  initialValue(props: InputProps<PickValues>): PickValues {
    return {
      algea: [],
      collected: { coralFeeder: false, coralGround: false, algeaGround: false },
    };
  }

  getStartingState(props: InputProps<PickValues>):
    | {
        objectives: PickValues;
      }
    | undefined {
    return {
      objectives: this.initialValue(props),
    };
  }

  addAction(action: AlgeaAction) {
    this.state.objectives.algea.push(action);
    this.setState(this.state);
    this.storage.set(this.state.objectives);
  }

  updateCollection(collection: keyof Collected) {
    this.state.objectives.collected[collection] =
      !this.state.objectives.collected[collection];
    this.setState(this.state);
    this.storage.set(this.state.objectives);
  }

  getActionValue(action: AlgeaAction) {
    return this.state.objectives.algea.filter((value) => value === action)
      .length;
  }

  undo() {
    this.state.objectives.algea.pop();
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
        {this.getActionValue("processor")}
      </button>
    );

    const netMissButton = (
      <button className="buttonF" onClick={() => this.addAction("netMiss")}>
        {this.getActionValue("netMiss")}
      </button>
    );

    const netScoreButton = (
      <button
        className="buttonS mr-2 items-center flex flex-col justify-center"
        onClick={() => this.addAction("netScore")}
      >
        <h2 className="text-3xl font-extrabold">NET</h2>
        {this.getActionValue("netScore")}
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
