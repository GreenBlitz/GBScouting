import CounterInput from "./inputtypes/CounterInput";
import DropdownInput from "./inputtypes/ListInput";
import MapInput from "./inputtypes/MapInput";
import NumberInput from "./inputtypes/NumberInput";
import TextInput from "./inputtypes/TextInput";
import ScouterInput from "./ScouterInput";

export default class ScouterInputs {
  static create(inputs: ScouterInput<any, any, any>[]): React.JSX.Element[] {
    return inputs.map((input) => input.create());
  }

  static readonly ScouterName = new TextInput({
    name: "Scouter Name",
    doesReset: false,
  });
  static readonly Qual = new NumberInput({
    name: "Qual",
  });
  static readonly TeamNumber = new NumberInput({
    name: "Team Number",
  });
  static readonly GameSide = new DropdownInput({
    name: "Game Side",
    options: ["Blue", "Red"],
    doesReset: false,
  });
  static readonly StartingPosition = new DropdownInput({
    name: "Starting Position",
    options: ["Amp Side", "Middle", "Source Side", "No Show"],
  });
  static readonly SpeakerAutoScore = new CounterInput({
    name: "Speaker/Auto/Score",
    color: "#12a119",
    isNameHidden: true,
  });
  static readonly SpeakerAutoMiss = new CounterInput({
    name: "Speaker/Auto/Miss",
    color: "#8f0a0e",
    isNameHidden: true,
  });

  static readonly MapPoints = new MapInput({
    name: "MapPoints",
    width: 540 * 0.8,
    height: 240 * 0.8,
    imagePath: "../src/assets/Crescendo Map.png",
    isNameHidden: true,
  });

  static readonly AmpScore = new CounterInput({
    name: "Amp Score",
    color: "#12a119",
  });
  static readonly AmpMiss = new CounterInput({
    name: "Amp Miss",
    color: "#8f0a0e",
  });
  static readonly Climb = new DropdownInput({
    name: "Climb",
    options: [
      "Off Stage",
      "Park",
      "Climbed Alone",
      "Harmony",
      "Harmony Three Robots",
    ],
  });
  static readonly Trap = new DropdownInput({
    name: "Trap",
    options: ["Didn't Score", "Scored", "Miss"],
  });
  static readonly Comment = new TextInput({
    name: "Comment",
  });
}
