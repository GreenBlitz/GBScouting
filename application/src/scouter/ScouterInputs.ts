import DropdownInput from "./input-types/DropdownInput";
import NumberInput from "./input-types/NumberInput";
import TextInput from "./input-types/TextInput";
import ScouterInput from "./ScouterInput";
import CheckboxInput from "./input-types/CheckboxInput";
import CheckboxedSliderInput from "./input-types/CheckBoxedSliderInput";
import ReefPickInput from "./input-types/reef-levels/ReefPickInput";
import CollectionInput from "./input-types/CollectionInput";

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
    doesRemain: true,
    isLockable: true,
  });
  static readonly qual = new NumberInput({
    route: "qual",
    name: "Qual",
  });
  static readonly startingPosition = new DropdownInput({
    route: "startingPosition",
    name: "Starting Position",
    options: ["Close to Scouter", "Middle", "Far From Scouter"]
  });
  static readonly allianceColor = new DropdownInput({
    route: "allianceColor",
    name: "Alliance Color",
    options: ["Blue", "Red"]
  });
  static readonly teamNumber = new NumberInput({
    route: "teamNumber",
    name: "Team Number",
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
    options: ["Off Barge", "Park", "Shallow Cage", "Deep Cage", "Tried Deep"],
  });
  static readonly comment = new TextInput({
    route: "comment",
    name: "Comment",
  });

  static readonly teleReefPick = new ReefPickInput({
    route: "teleReefPick",
  });

  // static readonly autoMap = new AutonomousMapInput({ route: "autoMap" });
  // static readonly autoCollect = new CounterInput({
  //   route: "autoScore",
  //   name: "Coral Feeder",
  // });

  static readonly autoReefPick = new ReefPickInput({
    route: "autoReefPick",
  });

  static readonly endgameCollection = new CollectionInput({
    route: "collection",
  });
}
