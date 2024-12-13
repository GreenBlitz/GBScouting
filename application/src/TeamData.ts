import { SectionData } from "./strategy/charts/PieChart";
import { FieldLine, FieldObject, FieldPoint } from "./strategy/charts/MapChart";
import { Color } from "./utils/Color";
import { Match } from "./Utils";

interface Comment {
  body: string;
  qual: number;
}

export class TeamData {
  constructor(matches: Match[]) {
    console.log(matches)
  }
}
