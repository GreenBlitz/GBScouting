import React from "react";
import ScouterInput, { InputProps } from "../../ScouterInput";
import { StorageBackedInput } from "../../../utils/FolderStorage";
import SushiButton from "./SushiButton";

export interface Sushi {
  HasSeeded: boolean;
  HasHarvested: boolean;
}

export interface AllSushis {
  Sushi1: Sushi;
  Sushi2: Sushi;
  Sushi3: Sushi;
}

export interface AllSushisAndStorage {
  allSushis: AllSushis;
  storage: StorageBackedInput<AllSushis>;
}

export type SushiToBeChanged = keyof AllSushis;

export interface ValuesToBePassed {
  storage: StorageBackedInput<AllSushis>;
  sushiToBeChanged: SushiToBeChanged;
}

export class AutonomousMapInput extends ScouterInput<AllSushis> {
  create(): React.JSX.Element {
    return <AutonomousMapInput {...this.props} />;
  }

  renderInput(): React.ReactNode {
    const sushiButtons = Object.keys(this.getValue()).map((sushi) => {
      return (
        <SushiButton
          sushiToBeChanged={sushi as SushiToBeChanged}
          storage={this.storage}
        />
      );
    });
    const buttons = <div className="sushi-buttons">{sushiButtons}</div>;

    const blueAllienceAutonomousMap = (
      <div className="relative">
        <img
          className="relative w-96"
          src="/src/assets/blue-auto-map.png"
          alt="Field"
        ></img>
        {buttons}
      </div>
    );

    return <>{blueAllienceAutonomousMap}</>;
  }

  initialValue(props: InputProps<AllSushis>): AllSushis {
    return {
      Sushi1: { HasSeeded: false, HasHarvested: false },
      Sushi2: { HasSeeded: false, HasHarvested: false },
      Sushi3: { HasSeeded: false, HasHarvested: false },
    };
  }
}
