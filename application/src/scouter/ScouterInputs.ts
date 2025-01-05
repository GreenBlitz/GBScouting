import CounterInput from "./input-types/CounterInput";
import DropdownInput from "./input-types/DropdownInput";
import MapInput from "./input-types/MapInput";
import NumberInput from "./input-types/NumberInput";
import TextInput from "./input-types/TextInput";
import ScouterInput from "./ScouterInput";

export default class ScouterInputs {
  static create(inputs: ScouterInput<any, any, any>[]): React.JSX.Element[] {
    return inputs.map((input) => input.create());
  }

  static readonly scouterName = new TextInput({
    route: "scouterName",
    name: "Scouter Name",
    doesReset: false,
  },7);
  static readonly qual = new NumberInput({
    route: "qual",
    name: "Qual",
  },9);
  static readonly teamNumber = new NumberInput({
    route: "teamNumber",
    name: "Team Number",
  },2 * 8);
  static readonly gameSide = new DropdownInput({
    route: "gameSide",
    name: "Game Side",
    options: ["Blue", "Red"],
    doesReset: false,
  });
  static readonly startingPosition = new DropdownInput({
    route: "startingPosition",
    name: "Starting Position",
    options: ["Amp Side", "Middle", "Source Side", "No Show"],
  });
  static readonly speakerAutoScore = new CounterInput({
    route: "speakerAutoScore",
    name: "Score",
    color: "#12a119",
  },6);
  static readonly speakerAutoMiss = new CounterInput({
    route: "speakerAutoMiss",
    name: "Miss",
    color: "#8f0a0e",
  },6);

  static readonly mapPoints = new MapInput({
    route:"mapPoints",
    name: "MapPoints",
    width: 540 * 0.8,
    height: 240 * 0.8,
    imagePath: "../src/assets/crescendo-map.png",
  });

  static readonly ampScore = new CounterInput({
    route: "ampScore",
    name: "Score",
    color: "#12a119",
  },5);
  static readonly ampMiss = new CounterInput({
    route: "ampMiss",
    name: "Miss",
    color: "#8f0a0e",
  },5);
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
  },12);
}
