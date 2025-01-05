import CounterInput from "./input-types/CounterInput";
import DropdownInput from "./input-types/DropdownInput";
import NumberInput from "./input-types/NumberInput";
import TextInput from "./input-types/TextInput";
import ScouterInput from "./ScouterInput";
import CheckboxInput from "./input-types/CheckboxInput";

export default class ScouterInputs {
  static create(inputs: ScouterInput<any, any, any>[]): React.JSX.Element[] {
    return inputs.map((input) => input.create());
  }
  static assureStoredInputs(inputs: ScouterInput<any, any, any>[]): void {
    inputs.forEach((input) => input.storage.set(input.getValue()));
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
    options: ["Amp Side", "Middle", "Source Side"],
  });
  static readonly noShow = new CheckboxInput({
    route: "noShow",
    name: "No Show?",
  });
  static readonly speakerAutoScore = new CounterInput({
    route: "speakerAutoScore",
    name: "Score",
    color: "#12a119",
  });
  static readonly speakerAutoMiss = new CounterInput({
    route: "speakerAutoMiss",
    name: "Miss",
    color: "#8f0a0e",
  });
  static readonly climb = new DropdownInput({
    route: "climb",
    name: "Climb",
    options: [
      "Off Stage",
      "Park",
      "Climbed Alone",
      "Harmony",
      "Harmony Three Robots",
    ],
  });
  static readonly trap = new DropdownInput({
    route: "trap",
    name: "Trap",
    options: ["Didn't Score", "Scored", "Miss"],
  });
  static readonly comment = new TextInput({
    route: "comment",
    name: "Comment",
  });
}
