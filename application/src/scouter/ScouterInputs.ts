import CounterInput from "./inputtypes/CounterInput";
import DropdownInput from "./inputtypes/DropdownInput";
import MapInput from "./inputtypes/MapInput";
import NumberInput from "./inputtypes/NumberInput";
import TextInput from "./inputtypes/TextInput";
import ScouterInput from "./ScouterInput";

export default class ScouterInputs {
  static create(inputs: ScouterInput<any, any, any>[]): React.JSX.Element[] {
    return inputs.map((input) => input.create());
  }

  static readonly scouterName = new TextInput({
    name: "Scouter Name",
    doesReset: false,
  });
  static readonly qual = new NumberInput({
    name: "Qual",
  });
  static readonly teamNumber = new NumberInput({
    name: "Team Number",
  });
  static readonly gameSide = new DropdownInput({
    name: "Game Side",
    options: ["Blue", "Red"],
    doesReset: false,
  });
  static readonly startingPosition = new DropdownInput({
    name: "Starting Position",
    options: ["Amp Side", "Middle", "Source Side", "No Show"],
  });
  static readonly speakerAutoScore = new CounterInput({
    name: "Speaker/Auto/Score",
    color: "#12a119",
    isNameHidden: true,
  });
  static readonly speakerAutoMiss = new CounterInput({
    name: "Speaker/Auto/Miss",
    color: "#8f0a0e",
    isNameHidden: true,
  });

  static readonly mapPoints = new MapInput({
    name: "MapPoints",
    width: 540 * 0.8,
    height: 240 * 0.8,
    imagePath: "../src/assets/Crescendo Map.png",
    isNameHidden: true,
  });

  static readonly ampScore = new CounterInput({
    name: "Amp Score",
    color: "#12a119",
  });
  static readonly ampMiss = new CounterInput({
    name: "Amp Miss",
    color: "#8f0a0e",
  });
  static readonly climb = new DropdownInput({
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
    name: "Trap",
    options: ["Didn't Score", "Scored", "Miss"],
  });
  static readonly comment = new TextInput({
    name: "Comment",
  });
}
