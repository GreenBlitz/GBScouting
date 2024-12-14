import { SectionData } from "./strategy/charts/PieChart";
import { FieldLine, FieldObject, FieldPoint } from "./strategy/charts/MapChart";
import { Color } from "./utils/Color";
import { Match } from "./Utils";

interface Comment {
  body: string;
  qual: number;
}

export class TeamData {
  private matches: Match[];

  constructor(matches: Match[]) {
    this.matches = matches;
  }

  getAsLine(field: keyof Match): Record<number,string> {
    return Object.assign(
      {},
      ...Object.values(this.matches).map((match) => {
        return { [match.Qual]: (match[field] + "") };
      })
    );
  }
}
