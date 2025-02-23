import React from "react";
import { Collection } from "../../utils/SeasonUI";

import coralSVG from "../../assets/low-coral.svg";
import algeaSVG from "../../assets/low-algea.svg";
import ScouterInput, { InputProps } from "../ScouterInput";
import { StorageBacked } from "../../utils/FolderStorage";

type CollectionAction = keyof Collection;

class CollectionInput extends ScouterInput<
  Collection,
  {},
  { objectives: Collection }
> {
  private readonly undoStack: StorageBacked<CollectionAction[]>;

  constructor(props: InputProps<Collection>) {
    super(props);
    this.undoStack = this.storage.subItem<CollectionAction[]>("/undoStack");
  }

  create(): React.JSX.Element {
    return <CollectionInput {...this.props} />;
  }

  updateCollection(action: CollectionAction) {
    this.state.objectives[action] = !this.state.objectives[action];
    this.setState(this.state);
    this.storage.set(this.state.objectives);
    this.undoStack.set([...(this.undoStack.get() || []), action]);
  }
  renderInput(): React.ReactNode {
    const coralFeederButton = (
      <button
        className={`${
          this.state.objectives.coralFeederCollected
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
          this.state.objectives.coralGroundCollected
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
          this.state.objectives.algeaGroundCollected
            ? "button-green"
            : "button-red"
        } big-button ml-0`}
        onClick={() => this.updateCollection("algeaGroundCollected")}
      >
        <h2 className="absolute mb-16 text-2xl font-extrabold">Ground</h2>
        <img className="mt-6" src={algeaSVG} width={60} alt="Algea Icon" />
      </button>
    );

    const algeaCollectedButton = (
      <button
        className={`${
          this.state.objectives.algeaReefCollected
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
          this.state.objectives.algeaReefDropped ? "button-green" : "button-red"
        } big-button ml-0`}
        onClick={() => this.updateCollection("algeaReefDropped")}
      >
        <h2 className="absolute mb-16 text-2xl font-extrabold">Dropped</h2>
        <img className="mt-6" src={algeaSVG} width={60} alt="Algea Icon" />
      </button>
    );

    return (
      <div className="rower">
        {coralFeederButton}
        {coralGroundButton}
        {algeaGroundButton}
        {algeaCollectedButton}
        {algeaDroppedButton}
      </div>
    );
  }

  getStartingState(
    props: InputProps<Collection>
  ): { objectives: Collection } | undefined {
    return { objectives: this.getValue() };
  }

  initialValue(props: InputProps<Collection>): Collection {
    return {
      algeaReefCollected: false,
      algeaReefDropped: false,
      algeaGroundCollected: false,
      coralGroundCollected: false,
      coralFeederCollected: false,
    };
  }
}

export default CollectionInput;
