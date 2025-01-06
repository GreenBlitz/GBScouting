import CounterInput from "./input-types/CounterInput";
import DropdownInput from "./input-types/DropdownInput";
import NumberInput from "./input-types/NumberInput";
import TextInput from "./input-types/TextInput";
import ScouterInput from "./ScouterInput";
import CheckboxInput from "./input-types/CheckboxInput";
import OptionalSliderInput from "./input-types/OptionalSliderInput";

export default class ScouterInputs {
  static create(inputs: ScouterInput<any, any, any>[]): React.JSX.Element[] {
    return inputs.map((input) => input.create());
  }

  static allInputs() {
    return Object.values(ScouterInputs).filter(
      (input) => input instanceof ScouterInput
    );
  }

  static readonly scouterName = new TextInput({
    route: "scouterName",
    name: "Scouter Name",
    doesReset: false,
  });
  static readonly qual = new NumberInput({
    route: "qual",
    name: "Qual",
  });
  static readonly teamNumber = new NumberInput({
    route: "teamNumber",
    name: "Team Number",
  });
  static readonly gameSide = new DropdownInput({
    route: "gameSide",
    name: "Game Side",
    options: ["Blue", "Red"],
    doesReset: false,
  });
  static readonly startingPosition = new DropdownInput({
    route: "startingPosition",
    name: "Starting Position",
    options: ["Far Side", "Middle", "Close Side"],
  });
  static readonly noShow = new CheckboxInput({
    route: "noShow",
    name: "No Show?",
  });
  static readonly defense = new OptionalSliderInput({
    route: "defense",
    name: "Defense",
    min: 1,
    max: 5,
  });
  static readonly climb = new DropdownInput({
    route: "climb",
    name: "Climb",
    options: ["Off Barge", "Park", "Shallow Cage", "Deep Cage"],
  });
  static readonly comment = new TextInput({
    route: "comment",
    name: "Comment",
  });
}
