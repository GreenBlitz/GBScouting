import { Color } from "./utils/Color";
import { Match } from "./utils/Match";
import { SectionData } from "./strategy/charts/PieChart";
import Percent from "./utils/Percent";
import { Levels } from "./components/ReefForm";

interface Comment {
  body: string;
  qual: number;
}

export class TeamData {
  private matches: Match[];

  constructor(matches: Match[]) {
    this.matches = matches;
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
    return this.matches
      .map((match) => {
        return { body: match.comment, qual: match.qual };
      })
      .filter((comment) => comment.body !== "");
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
    Object.values(this.matches).forEach((match) => {
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

  getAverageCorals(): Levels {
    return this.matches.reduce(
      (accumulator, match) => {
        const matchLevel = match.reefForm;
        return {
          L1: {
            score: accumulator.L1.score + matchLevel.L1.score,
            miss: accumulator.L1.miss + matchLevel.L1.miss,
          },
          L2: {
            score: accumulator.L2.score + matchLevel.L2.score,
            miss: accumulator.L2.miss + matchLevel.L2.miss,
          },
          L3: {
            score: accumulator.L3.score + matchLevel.L3.score,
            miss: accumulator.L3.miss + matchLevel.L3.miss,
          },
          L4: {
            score: accumulator.L4.score + matchLevel.L4.score,
            miss: accumulator.L4.miss + matchLevel.L4.miss,
          },
        };
      },
      {
        L1: { score: 0, miss: 0 },
        L2: { score: 0, miss: 0 },
        L3: { score: 0, miss: 0 },
        L4: { score: 0, miss: 0 },
      } as Levels
    );
  }

  getAsLinearHistogram<Options extends string>(field: keyof Match) {
    const values: { value: number; sectionName: Options }[] = [];
    let valuesIndex = 0;

    Object.values(this.matches).forEach((match) => {
      if (typeof match[field] !== "string") {
        throw new Error("Invalid field: " + field);
      }

      const section = match[field] as Options;
      if (values.length === 0) {
        values[0] = { value: 1, sectionName: section };
        return;
      } else if (values[valuesIndex].sectionName === section) {
        values[valuesIndex].value++;
      } else {
        valuesIndex++;
        values[valuesIndex] = { value: 1, sectionName: section };
      }
    });

    return values;
  }
}
