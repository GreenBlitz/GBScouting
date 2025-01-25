import React from "react";
import ScouterInput, { InputProps } from "../../ScouterInput";
import AutonomousForm from "./AutonomousForm";
import { StorageBackedInput } from "../../../utils/FolderStorage";

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
  sushies: AllSushis;
  sushiToBeChanged: SushiToBeChanged;
}

export class AutonomousMapInput extends ScouterInput<AllSushis> {
  renderInput(): React.ReactNode {
    return (
      <AutonomousForm allSushis={this.getValue()} storage={this.storage} />
    );
  }
  create(): React.JSX.Element {
    return <AutonomousMapInput {...this.props} />;
  }
    initialValue(props: InputProps<AllSushis>): AllSushis {
    return {
      Sushi1: { HasSeeded: false, HasHarvested: false },
      Sushi2: { HasSeeded: false, HasHarvested: false },
      Sushi3: { HasSeeded: false, HasHarvested: false },
    };
  }
}
