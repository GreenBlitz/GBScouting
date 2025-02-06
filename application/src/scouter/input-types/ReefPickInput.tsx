import React from "react";
import ScouterInput, { InputProps } from "../ScouterInput";
import "../../components/reefScore.css";
import coralSVG from "../../assets/low-coral.svg";
import algeaSVG from "../../assets/low-algea.svg";
import ReefInput from "./ReefInput";

type AlgeaScored = "netScore" | "netMiss" | "processor";
type Collected = "coralFeeder" | "coralGround" | "algeaGround";

type PossibleActions = AlgeaScored | Collected;
type PickedObjective = PossibleActions;

class ReefPickInput extends ScouterInput<
  PickedObjective[],
  { reefInput: ReefInput },
  {
    objectives: PickedObjective[];
  }
> {
  create(): React.JSX.Element {
    return <ReefPickInput {...this.props} />;
  }
  initialValue(props: InputProps<PickedObjective[]>): PickedObjective[] {
    return [];
  }

  getStartingState(props: InputProps<PickedObjective[]>):
    | {
        objectives: PickedObjective[];
      }
    | undefined {
    return {
      objectives: this.getValue(),
    };
  }

  addAction(action: PossibleActions) {
    this.state.objectives.push(action);
    this.setState(this.state);
    this.storage.set(this.state.objectives);
  }

  getActionValue(action: PossibleActions) {
    return this.state.objectives.filter((value) => value === action).length;
  }

  undo() {
    this.state.objectives.pop();
    this.setState(this.state);
    this.storage.set(this.state.objectives);
  }

  renderInput(): React.ReactNode {
    const coralFeederButton = (
      <button
        className="buttonS mr-2 items-center flex flex-col justify-center relative"
        onClick={() => this.addAction("coralFeeder")}
      >
        <h2 className="absolute mb-16 text-2xl font-extrabold">Feeder</h2>
        <img className="mt-2" src={coralSVG} width={80} alt="Coral Icon" />
        <span className="absolute mt-2 inset-0 flex items-center justify-center text-2xl text-black font-bold">
          {this.getActionValue("coralFeeder")}
        </span>
      </button>
    );

    const coralGroundButton = (
      <button
        className="buttonS ml-4 mr-2 items-center flex flex-col justify-center relative"
        onClick={() => this.addAction("coralGround")}
      >
        <h2 className="absolute mb-16 text-2xl font-extrabold">Ground</h2>
        <img className="mt-2" src={coralSVG} width={80} alt="Coral Icon" />
        <span className="absolute mt-2 inset-0 flex items-center justify-center text-2xl text-black font-bold">
          {this.getActionValue("coralGround")}
        </span>
      </button>
    );

    const algeaGroundButton = (
      <button
        className="buttonS ml-4 mr-2 items-center flex flex-col justify-center relative"
        onClick={() => this.addAction("algeaGround")}
      >
        <h2 className="absolute mb-16 text-2xl font-extrabold">Ground</h2>
        <img className="mt-6" src={algeaSVG} width={60} alt="Algea Icon" />
        <span className="absolute mt-6 inset-0 flex items-center justify-center text-2xl text-black font-bold">
          {this.getActionValue("algeaGround")}
        </span>
      </button>
    );

    return (
      <div className="flex items-center justify-center flex-col">
        <div className="flex flex-row justify-center">
          <button
            className="buttonS mr-2 items-center flex flex-col justify-center"
            onClick={() => this.addAction("netScore")}
          >
            <h2 className="text-3xl font-extrabold">NET</h2>
            {this.getActionValue("netScore")}
          </button>
          <button className="buttonF" onClick={() => this.addAction("netMiss")}>
            {this.getActionValue("netMiss")}
          </button>
        </div>
        <button
          className="buttonS ml-4 mr-2 items-center flex flex-col justify-center mb-4"
          onClick={() => this.addAction("processor")}
        >
          <h2 className="text-3xl font-extrabold">PRO.</h2>
          {this.getActionValue("processor")}
        </button>
        {this.props.reefInput.create()}
        <div className="flex flex-row justify-center">
          {coralFeederButton}
          {coralGroundButton}
        </div>
        {algeaGroundButton}
        <div>
          <button
            onClick={() => this.undo()}
            className="bg-[#596c86] w-48 h-16 text-white py-2 px-4 rounded mt-4"
          >
            Undo
          </button>
        </div>
      </div>
    );
  }
}

export default ReefPickInput;
