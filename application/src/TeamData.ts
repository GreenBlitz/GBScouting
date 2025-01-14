import { Color } from "./utils/Color";
import { Match } from "./utils/Match";
import { SectionData } from "./strategy/charts/PieChart";
import Percent from "./utils/Percent";
import { FieldObject } from "./scouter/input-types/MapInput";

interface Comment {
  body: string;
  qual: number;
}

export class TeamData {
  public readonly matches: Match[];

  constructor(matches: Match[]) {
    this.matches = { ...matches };
  }

  getAsLine(field: keyof Match): Record<string, number> {
    return Object.assign(
      {},
      ...Object.values(this.matches).map((match) => {
        if (typeof match[field] !== "number") {
          throw new Error("Invalid field: " + field);
        }
        return { [match.qual.toString()]: match[field] };
      })
    );
  }

  getComments(): Comment[] {
    return this.matches.map((match) => {
      return { body: match.comment, qual: match.qual };
    });
  }

  getAccuracy(percentField: keyof Match, compareField: keyof Match): Percent {
    const averages = [
      this.getAverage(percentField),
      this.getAverage(compareField),
    ];
    return Percent.fromList(averages)[0];
  }

  getAverage(field: keyof Match): number {
    if (this.matches.length === 0) {
      return 0;
    }
    return this.matches
      .map((match) => {
        if (typeof match[field] !== "number") {
          throw new Error("Invalid field: " + field);
        }
        return match[field];
      })
      .reduce((accumulator, value) => {
        return accumulator + value;
      });
  }

  getAsPie(
    field: keyof Match,
    colorMap: Record<string, Color>
  ): Record<string, SectionData> {
    const dataSet: Record<string, SectionData> = {};
    Object.entries(this.matches).forEach(([_, match]) => {
      if (typeof match[field] !== "string") {
        throw new Error("Invalid field: " + field);
      }
      const dataValue = match[field];
      if (!dataSet[dataValue]) {
        dataSet[dataValue] = { percentage: 0, color: colorMap[dataValue] };
      }
      dataSet[dataValue].percentage++;
    });
    return dataSet;
  }
}
