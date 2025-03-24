import DropdownInput from "./input-types/DropdownInput";
import NumberInput from "./input-types/NumberInput";
import TextInput from "./input-types/TextInput";
import ScouterInput from "./ScouterInput";
import CheckboxInput from "./input-types/CheckboxInput";
import CheckboxedSliderInput from "./input-types/CheckBoxedSliderInput";
import ReefPickInput from "./input-types/reef-levels/ReefPickInput";
import CollectionInput from "./input-types/CollectionInput";
import TeamNumberInput from "./input-types/TeamNumberInput";
import ManualTeamNumberInput from "./input-types/ManualTeamNumberInput";

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
  static readonly teamNumber = new ManualTeamNumberInput({
    route: "teamNumber",
    name: "",
    twoOptions: {
      options1: ["Close", "Middle", "Far"],
      options2: ["Blue", "Red"],
    },
    doesRemain: true,
  });
  static readonly noShow = new CheckboxInput({
    route: "noShow",
    name: "No Show?",
  });
  static readonly defense = new CheckboxedSliderInput({
    route: "defense",
    name: "Defending Other Robots",
    min: 1,
    max: 5,
  });
  static readonly defensiveEvasion = new CheckboxedSliderInput({
    route: "defensiveEvasion",
    name: "Escapes Defence",
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
