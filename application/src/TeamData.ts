import { Color } from "./utils/Color";
import { Match } from "./utils/Match";
import { SectionData } from "./strategy/charts/PieChart";
import Percent from "./utils/Percent";
import { Levels } from "./components/ReefForm";
import { Auto } from "./utils/SeasonUI";
import { AlgeaAction, PickValues } from "./scouter/input-types/ReefPickInput";

interface Comment {
  body: string;
  qual: number;
}

export class TeamData {
  public readonly matches: Match[];

  constructor(matches: Match[]) {
    this.matches = [...matches];
  }

  getAsLine(
    field: keyof Match,
    innerFields?: string[]
  ): Record<string, number> {
    return Object.assign(
      {},
      ...Object.values(this.matches).map((match) => {
        if (!match[field] || match[field] === "undefined") {
          return;
        }
        console.log(field + ", " + innerFields);
        const value = innerFields
          ? innerFields.reduce(
              (accumulator, innerField) => accumulator[innerField],
              match[field]
            )
          : match[field];
        if (typeof value !== "number") {
          throw new Error("Invalid field: " + field + " " + innerFields);
        }
        return { [match.qual.toString()]: value };
      })
    );
  }

  getAlgeaDataAsLine(
    reefPick: keyof Match,
    field: AlgeaAction
  ): Record<string, number> {
    return Object.assign(
      {},
      ...Object.values(this.matches).map((match) => {
        if (!match[reefPick] || match[reefPick] === "undefined") {
          return;
        }
        return {
          [match.qual.toString()]: this.getReefPickData(
            match[reefPick] as PickValues,
            field
          ),
        };
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

  getAverageScore() {
    const scores = Object.values(this.getScores());
    return (
      scores.reduce((accumulator, value) => accumulator + value, 0) /
      scores.length
    );
  }

  getScores(): Record<string, number> {
    return Object.assign(
      {},
      ...this.matches.map((match) => {
        let sum = 0;

        sum += match.teleopReefLevels.L1.score * 2;
        sum += match.teleopReefLevels.L2.score * 3;
        sum += match.teleopReefLevels.L3.score * 4;
        sum += match.teleopReefLevels.L4.score * 5;

        sum += this.getReefPickData(match.teleReefPick, "netScore") * 4;
        sum += this.getReefPickData(match.teleReefPick, "processor") * 4;

        sum += match.autoReefLevels.L1.score * 3;
        sum += match.autoReefLevels.L2.score * 4;
        sum += match.autoReefLevels.L3.score * 6;
        sum += match.autoReefLevels.L4.score * 7;

        sum += this.getReefPickData(match.autoReefPick, "netScore") * 4;
        sum += this.getReefPickData(match.autoReefPick, "processor") * 4;

        const getClimb = () => {
          switch (match.climb) {
            case "Park":
              return 2;
            case "Shallow Cage":
              return 6;
            case "Deep Cage":
              return 12;
          }
          return 0;
        };

        sum += getClimb();

        return { [match.qual]: sum };
      })
    );
  }

  getAverageReefPickData(reefPick: keyof Match, data: AlgeaAction) {
    if (this.matches.length === 0) {
      return 0;
    }
    return (
      this.matches.reduce((accumulator, match) => {
        const reef: PickValues = match[reefPick] as PickValues;
        const value = this.getReefPickData(reef, data);
        return value + accumulator;
      }, 0) / this.matches.length
    );
  }

  getReefPickData(reef: PickValues, data: AlgeaAction) {
    return reef.algea.filter((value) => value === data).length;
  }

  getAverageAutoScore() {
    if (this.matches.length === 0) {
      return 0;
    }
    return (
      this.matches
        .map((match) => {
          let sum = 0;

          sum += match.autoReefLevels.L1.score * 3;
          sum += match.autoReefLevels.L2.score * 4;
          sum += match.autoReefLevels.L3.score * 6;
          sum += match.autoReefLevels.L4.score * 7;

          sum += this.getReefPickData(match.autoReefPick, "netScore") * 4;
          sum += this.getReefPickData(match.autoReefPick, "processor") * 4;

          return sum;
        })
        .reduce((accumulator, value) => accumulator + value, 0) /
      this.matches.length
    );
  }

  getAccuracy(percentField: keyof Match, compareField: keyof Match): Percent {
    const averages = [
      this.getAverage(percentField),
      this.getAverage(compareField),
    ];
    return Percent.fromList(averages)[0];
  }

  getAverage(field: keyof Match, innerFields?: string[]): number {
    if (this.matches.length === 0) {
      return 0;
    }
    return (
      this.matches
        .map((match) => {
          if (match[field] === undefined || match[field] === "undefined") {
            return 0;
          }
          const value = innerFields
            ? innerFields.reduce(
                (accumulator, innerField) => accumulator[innerField],
                match[field]
              )
            : match[field];

          if (typeof value !== "number") {
            throw new Error("Invalid field: " + field);
          }
          return value;
        })
        .reduce((accumulator, value) => {
          return accumulator + value;
        }) / this.matches.length
    );
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

  getAverageCorals(field: keyof Match): Levels {
    return this.matches.reduce(
      (accumulator, match) => {
        const matchLevel: Levels = match[field] as Levels;
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

  getAutoCorals() {
    return this.getAverageCorals("autoReefLevels");
  }

  getTeleopCorals() {
    return this.getAverageCorals("teleopReefLevels");
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

  getAutos(): Auto[] {
    return this.matches.map((match) => {
      return {
        collected: match.autoMap,
        feeded: match.autoCollect,
        scored: match.autoReefLevels,
      };
    });
  }
}
