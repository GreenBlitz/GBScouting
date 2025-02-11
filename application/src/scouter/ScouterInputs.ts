import { AutonomousMapInput } from "./input-types/auto-map/AutonomousMapInput";
import CounterInput from "./input-types/CounterInput";
import DropdownInput from "./input-types/DropdownInput";
import NumberInput from "./input-types/NumberInput";
import TextInput from "./input-types/TextInput";
import ScouterInput from "./ScouterInput";
import CheckboxInput from "./input-types/CheckboxInput";
import CheckboxedSliderInput from "./input-types/CheckboxedSliderInput";
import TeleopForm from "../components/TeleopForm";
import ReefPickInput from "./input-types/ReefPickInput";
import ReefInput from "./input-types/ReefInput";

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
  static readonly defense = new CheckboxedSliderInput({
    route: "defense",
    name: "Defended",
    min: 1,
    max: 5,
  });
  static readonly defensiveEvasion = new CheckboxedSliderInput({
    route: "defensiveEvasion",
    name: "Defense Evasion",
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

  static readonly teleopReef = new ReefInput({
    route: "teleopReef",
    navigationDestination: "../reef",
    triangleColor: "#18723c",
    backgroundColor: "#2c2c2c",
  });

  static readonly teleopReefLevels = new TeleopForm({
    route: "teleopReefLevels",
    reefInput: this.teleopReef,
  });

  static readonly teleReefPick = new ReefPickInput({
    route: "teleReefPick",
    reefInput: this.teleopReef,
  });

  // static readonly autoMap = new AutonomousMapInput({ route: "autoMap" });
  // static readonly autoCollect = new CounterInput({
  //   route: "autoScore",
  //   name: "Coral Feeder",
  // });

  static readonly autoReef = new ReefInput({
    route: "autoReef",
    navigationDestination: "../reef",
    triangleColor: "#18723c",
    backgroundColor: "#1f2937",
  });

  static readonly autoReefLevels = new TeleopForm({
    route: "autoReefLevels",
    reefInput: this.autoReef,
  });

  static readonly autoReefPick = new ReefPickInput({
    route: "autoReefPick",
    reefInput: this.autoReef,
  });
}
