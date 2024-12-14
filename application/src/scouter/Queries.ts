import CounterQuery from "./querytypes/CounterQuery";
import ListQuery from "./querytypes/ListQuery";
import MapQuery from "./querytypes/MapQuery";
import NumberQuery from "./querytypes/NumberQuery";
import TextQuery from "./querytypes/TextQuery";
import ScouterQuery from "./ScouterQuery";

export default class Queries {

  static render(queries: ScouterQuery<any,any,any>[]) {
    return queries.map((query) => query.render());
  }

  static readonly ScouterName = new TextQuery({
    name: "Scouter Name",
  });
  static readonly Qual = new NumberQuery({
    name: "Qual",
  });
  static readonly TeamNumber = new NumberQuery({
    name: "Team Number",
  });
  static readonly GameSide = new ListQuery({
    name: "Game Side",
    list: ["Blue", "Red"],
  });
  static readonly StartingPosition = new ListQuery({
    name: "Starting Position",
    list: ["Amp Side", "Middle", "Source Side", "No Show"],
  });
  static readonly SpeakerAutoScore = new CounterQuery({
    name: "Speaker/Auto/Score",
    color: "#12a119",
  });
  static readonly SpeakerAutoMiss = new CounterQuery({
    name: "Speaker/Auto/Miss",
    color: "#8f0a0e",
  });

  static readonly MapPoints = new MapQuery({
    name:"MapPoints",
  })

  static readonly AmpScore = new CounterQuery({
    name: "Amp Score",
    color: "#12a119",
  });
  static readonly AmpMiss = new CounterQuery({
    name: "Amp Miss",
    color: "#8f0a0e",
  });
  static readonly Climb = new ListQuery({
    name: "Climb",
    list: [
      "Off Stage",
      "Park",
      "Climbed Alone",
      "Harmony",
      "Harmony Three Robots",
    ],
  });
  static readonly Trap = new ListQuery({
    name: "Trap",
    list: ["Didn't Score", "Scored", "Miss"],
  });
  static readonly Comment = new TextQuery({
    name: "Comment",
  });
}