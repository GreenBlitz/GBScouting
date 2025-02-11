import { Color } from "./utils/Color";
import { Match } from "./utils/Match";
import { SectionData } from "./strategy/charts/PieChart";
import Percent from "./utils/Percent";
import { Levels } from "./components/teleopForm";
import { Auto, Collection as Collection, UsedAlgea } from "./utils/SeasonUI";
import { PickValues } from "./scouter/input-types/ReefPickInput";
import { AllScore } from "./components/TeleopForm";
import { ReefSide } from "./scouter/input-types/ReefInput";

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
    field: keyof UsedAlgea
  ): Record<string, number> {
    return Object.assign(
      {},
      ...Object.values(this.matches).map((match) => {
        if (!match[reefPick] || match[reefPick] === "undefined") {
          return;
        }
        return {
          [match.qual.toString()]: (match[reefPick] as PickValues)[field],
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

        sum += match.teleReefPick.algea.netScore * 4;
        sum += match.teleReefPick.algea.processor * 4;

        sum += match.autoReefLevels.L1.score * 3;
        sum += match.autoReefLevels.L2.score * 4;
        sum += match.autoReefLevels.L3.score * 6;
        sum += match.autoReefLevels.L4.score * 7;

        sum += match.autoReefPick.algea.netScore * 4;
        sum += match.autoReefPick.algea.processor * 4;

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

  getAverageReefPickData(reefPick: keyof Match, data: keyof UsedAlgea) {
    if (this.matches.length === 0) {
      return 0;
    }
    return (
      this.matches.reduce((accumulator, match) => {
        const reef: PickValues = match[reefPick] as PickValues;
        const value = reef.algea[data];
        return value + accumulator;
      }, 0) / this.matches.length
    );
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

          sum += match.autoReefPick.algea.netScore * 4;
          sum += match.autoReefPick.algea.processor * 4;

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

  getAverageCoralAmount() {
    if (this.matches.length === 0) {
      return 0;
    }
    return (
      this.matches.reduce((accumulator, match) => {
        return (
          match.autoReefLevels.L1.score +
          match.autoReefLevels.L2.score +
          match.autoReefLevels.L3.score +
          match.autoReefLevels.L4.score +
          match.teleopReefLevels.L1.score +
          match.teleopReefLevels.L2.score +
          match.teleopReefLevels.L3.score +
          match.teleopReefLevels.L4.score +
          accumulator
        );
      }, 0) / this.matches.length
    );
  }

  getAverageObjectAmount() {
    if (this.matches.length === 0) {
      return 0;
    }
    return (
      this.matches.reduce((accumulator, match) => {
        return (
          match.autoReefLevels.L1.score +
          match.autoReefLevels.L2.score +
          match.autoReefLevels.L3.score +
          match.autoReefLevels.L4.score +
          match.teleopReefLevels.L1.score +
          match.teleopReefLevels.L2.score +
          match.teleopReefLevels.L3.score +
          match.teleopReefLevels.L4.score +
          match.autoReefPick.algea.netScore +
          match.autoReefPick.algea.processor +
          match.teleReefPick.algea.netScore +
          match.teleReefPick.algea.processor +
          accumulator
        );
      }, 0) / this.matches.length
    );
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
            sides: [],
          },
          L2: {
            score: accumulator.L2.score + matchLevel.L2.score,
            miss: accumulator.L2.miss + matchLevel.L2.miss,
            sides: [],
          },
          L3: {
            score: accumulator.L3.score + matchLevel.L3.score,
            miss: accumulator.L3.miss + matchLevel.L3.miss,
            sides: [],
          },
          L4: {
            score: accumulator.L4.score + matchLevel.L4.score,
            miss: accumulator.L4.miss + matchLevel.L4.miss,
            sides: [],
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

  getCollections(levels: keyof Match, pick: keyof Match): Collection {
    return this.matches.reduce<Collection>(
      (accumulator, match) => {
        const reefLevels = match[levels] as AllScore;
        const reefPick = match[pick] as PickValues;
        return {
          algeaReefCollected:
            reefLevels.algea.collected || accumulator.algeaReefCollected,
          algeaReefDropped:
            reefLevels.algea.dropped || accumulator.algeaReefDropped,
          algeaGroundCollected:
            reefPick.collected.algeaGround || accumulator.algeaGroundCollected,
          coralGroundCollected:
            reefPick.collected.coralGround || accumulator.coralGroundCollected,
          coralFeederCollected:
            reefPick.collected.coralFeeder || accumulator.coralFeederCollected,
        };
      },
      {
        algeaReefCollected: false,
        algeaReefDropped: false,
        algeaGroundCollected: false,
        coralGroundCollected: false,
        coralFeederCollected: false,
      }
    );
  }

  getUsedSides(levels: keyof Match) {
    this.matches.reduce<ReefSide[]>((matchesAccumulator, match) => {
      const sides = matchesAccumulator.concat(
        Object.values(match[levels] as Levels).reduce<ReefSide[]>(
          (accumulator, level) => [...accumulator, level],
          []
        )
      );

      return sides.filter((side, index) => sides.indexOf(side) === index);
    }, []);
  }

  getAutos(): Auto[] {
    return this.matches.map((match) => {
      return {
        corals: match.autoReefLevels,
        qual: match.qual,

        algeaScoring: match.autoReefPick.algea,
      };
    });
  }
}
