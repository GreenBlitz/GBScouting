import { Color } from "./utils/Color";
import { Match, randomMatch } from "./utils/Match";
import { SectionData } from "./strategy/charts/PieChart";
import Percent from "./utils/Percent";
import {
  Auto,
  Collection as Collection,
  Notes,
  NumberedCollection,
  UsedAlgea,
} from "./utils/SeasonUI";
import {
  Levels,
  PickValues,
} from "./scouter/input-types/reef-levels/ReefPickInput";

export interface Comment {
  body: string;
  qual: string;
}

interface UsedNotes {
  qual: string;
  body: Notes;
}

export class TeamData {
  public readonly matches: Match[];
  public readonly notes: UsedNotes[];

  constructor(matches: Match[], notes?: UsedNotes[]) {
    this.matches = [...matches];

    this.notes = (notes || [])
      .filter((note) =>
        this.matches.some((match) => match.qual === parseInt(note.qual))
      )
      .sort((note1, note2) => parseInt(note1.qual) - parseInt(note2.qual));
  }

  static random(teamNumber: number) {
    return new TeamData(
      [1, 6, 11, 16, 21, 26].map((qual) => randomMatch(teamNumber, qual))
    );
  }

  static matchObjects(match: Match) {
    return (
      match.teleReefPick.levels.L1.score +
      match.teleReefPick.levels.L2.score +
      match.teleReefPick.levels.L3.score +
      match.teleReefPick.levels.L4.score +
      match.teleReefPick.algea.netScore +
      match.teleReefPick.algea.processor +
      match.autoReefPick.levels.L1.score +
      match.autoReefPick.levels.L2.score +
      match.autoReefPick.levels.L3.score +
      match.autoReefPick.levels.L4.score +
      match.autoReefPick.algea.netScore +
      match.autoReefPick.algea.processor
    );
  }

  static matchScore(match: Match) {
    let sum = 0;

    sum += match.teleReefPick.levels.L1.score * 2;
    sum += match.teleReefPick.levels.L2.score * 3;
    sum += match.teleReefPick.levels.L3.score * 4;
    sum += match.teleReefPick.levels.L4.score * 5;

    sum += match.teleReefPick.algea.netScore * 4;
    sum += match.teleReefPick.algea.processor * 4;

    sum += match.autoReefPick.levels.L1.score * 3;
    sum += match.autoReefPick.levels.L2.score * 4;
    sum += match.autoReefPick.levels.L3.score * 6;
    sum += match.autoReefPick.levels.L4.score * 7;

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
        case "Tried Deep":
          return 2;
      }
      return 0;
    };

    sum += getClimb();
    return sum;
  }

  static stringedQual(qual: number) {
    if (qual > 100) {
      return "P" + (qual - 100).toString();
    }
    return "Q" + qual.toString();
  }

  getTeamNumber() {
    if (!this.matches[0]) {
      return 0;
    }
    return this.matches[0].teamNumber.teamNumber;
  }

  getAsLine(
    field: keyof Match,
    innerFields?: string[]
  ): Record<string, number> {
    return Object.assign(
      {},
      ...Object.values(this.matches).map((match) => {
        if (!match[field] || match[field] === "undefined") {
          return { [TeamData.stringedQual(match.qual)]: null };
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
        return { [TeamData.stringedQual(match.qual)]: value };
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
          [TeamData.stringedQual(match.qual)]: (match[reefPick] as PickValues)
            .algea[field],
        };
      })
    );
  }

  getComments(): Comment[] {
    return this.matches
      .map((match) => {
        return { body: match.comment, qual: TeamData.stringedQual(match.qual) };
      })
      .filter((comment) => comment.body !== "");
  }

  getAverageScore() {
    if (this.matches.length === 0) {
      return 0;
    }
    const scores = Object.values(this.getScores());
    return (
      scores.reduce((accumulator, value) => accumulator + value, 0) /
      scores.length
    );
  }

  getTeleopObjectsAsLine() {
    return Object.assign(
      {},
      ...Object.values(this.matches).map((match) => {
        return {
          [TeamData.stringedQual(match.qual)]:
            match.teleReefPick.levels.L1.score +
            match.teleReefPick.levels.L2.score +
            match.teleReefPick.levels.L3.score +
            match.teleReefPick.levels.L4.score +
            match.teleReefPick.algea.netScore +
            match.teleReefPick.algea.processor,
        };
      })
    );
  }

  getScores(): Record<string, number> {
    return Object.assign(
      {},
      ...this.matches.map((match) => {
        return {
          [TeamData.stringedQual(match.qual)]: TeamData.matchScore(match),
        };
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

          sum += match.autoReefPick.levels.L1.score * 3;
          sum += match.autoReefPick.levels.L2.score * 4;
          sum += match.autoReefPick.levels.L3.score * 6;
          sum += match.autoReefPick.levels.L4.score * 7;

          sum += match.autoReefPick.algea.netScore * 4;
          sum += match.autoReefPick.algea.processor * 4;

          return sum;
        })
        .reduce((accumulator, value) => accumulator + value, 0) /
      this.matches.length
    );
  }

  getAccuracy(
    percentField: keyof Match,
    compareField: keyof Match,
    innerPercentFields?: string[],
    innerCompareFields?: string[]
  ): Percent {
    const averages = [
      this.getAverage(percentField, innerPercentFields),
      this.getAverage(compareField, innerCompareFields),
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
          match.autoReefPick.levels.L1.score +
          match.autoReefPick.levels.L2.score +
          match.autoReefPick.levels.L3.score +
          match.autoReefPick.levels.L4.score +
          match.teleReefPick.levels.L1.score +
          match.teleReefPick.levels.L2.score +
          match.teleReefPick.levels.L3.score +
          match.teleReefPick.levels.L4.score +
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
          match.autoReefPick.levels.L1.score +
          match.autoReefPick.levels.L2.score +
          match.autoReefPick.levels.L3.score +
          match.autoReefPick.levels.L4.score +
          match.teleReefPick.levels.L1.score +
          match.teleReefPick.levels.L2.score +
          match.teleReefPick.levels.L3.score +
          match.teleReefPick.levels.L4.score +
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

    const filteredMatches = this.matches.filter((match) => {
      return match[field] !== undefined && match[field] !== "undefined";
    });
    if (filteredMatches.length === 0) {
      return 0;
    }

    return (
      filteredMatches
        .map((match) => {
          if (
            match[field] === undefined ||
            match[field] === null ||
            match[field] === "null" ||
            match[field] === "undefined"
          ) {
            return 0;
          }
          const value = innerFields
            ? innerFields.reduce(
                (accumulator, innerField) => accumulator[innerField],
                match[field]
              )
            : match[field];

          if (typeof value !== "number") {
            throw new Error(
              "Invalid field: " + field + ", with value: " + value
            );
          }
          return value;
        })
        .reduce((accumulator, value) => {
          return accumulator + value;
        }) / filteredMatches.length
    );
  }

  getAsBox(mapFunction: (match: Match) => number | undefined): number[] {
    return this.matches.map(mapFunction).filter((value) => value !== undefined);
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
        const matchLevel: Levels = (match[field] as PickValues).levels;
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

  getAverageNet(field: keyof Match): UsedAlgea {
    return this.matches.reduce(
      (accumulator, match) => {
        const matchLevel: UsedAlgea = (match[field] as PickValues)?.algea ?? {
          netScore: 0,
          netMiss: 0,
          processor: 0,
        };

        return {
          netScore: accumulator.netScore + matchLevel.netScore,
          netMiss: accumulator.netMiss + matchLevel.netMiss,
          processor: accumulator.processor + matchLevel.processor,
        };
      },
      { netScore: 0, netMiss: 0, processor: 0 } as UsedAlgea // Initial accumulator value
    );
  }

  getAutoCorals() {
    return this.getAverageCorals("autoReefPick");
  }

  getTeleopCorals() {
    return this.getAverageCorals("teleReefPick");
  }
  getAutopNet() {
    return this.getAverageNet("autoReefPick");
  }
  getTeleopNet() {
    return this.getAverageNet("teleReefPick");
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

  getCollections(): NumberedCollection {
    return this.matches.reduce<NumberedCollection>(
      (accumulator, match) => {
        const collection = match.endgameCollection;
        return {
          algeaReefCollected:
            +collection.algeaReefCollected + accumulator.algeaReefCollected,
          algeaReefDropped:
            +collection.algeaReefCollected + accumulator.algeaReefDropped,
          algeaGroundCollected:
            +collection.algeaGroundCollected + accumulator.algeaGroundCollected,
          coralGroundCollected:
            +collection.coralGroundCollected + accumulator.coralGroundCollected,
          coralFeederCollected:
            +collection.coralFeederCollected + accumulator.coralFeederCollected,
        };
      },
      {
        algeaReefCollected: 0,
        algeaReefDropped: 0,
        algeaGroundCollected: 0,
        coralGroundCollected: 0,
        coralFeederCollected: 0,
      }
    );
  }

  getAutos(): Auto[] {
    return this.matches.map((match) => {
      return {
        corals: match.autoReefPick.levels,
        qual: match.qual,

        algeaScoring: match.autoReefPick.algea,
      };
    });
  }

  getAverageClimb(): number {
    if (this.matches.length <= 0) {
      return 0;
    }

    return (
      this.matches.reduce((accumulator, { climb }) => {
        const getValue = () => {
          switch (climb) {
            case "Park":
              return 2;
            case "Shallow Cage":
              return 6;
            case "Deep Cage":
              return 12;
            case "Tried Deep":
              return 2;
          }
          return 0;
        };
        return getValue() + accumulator;
      }, 0) / this.matches.length
    );
  }

  getClimbPercentage(climb: string): Percent {
    return Percent.fromRatio(
      this.matches.filter((match) => match.climb === climb).length,
      this.matches.length
    );
  }

  getProcessorPercentage() {
    return Percent.fromRatio(
      this.matches.filter(
        (match) =>
          match.teleReefPick.algea.processor > 0 ||
          match.autoReefPick.algea.processor > 0
      ).length,
      this.matches.length
    );
  }

  getReefPickPercentage(innerFields: string[]) {
    return Percent.fromRatio(
      this.matches.filter((match) => {
        return (
          innerFields.reduce(
            (accumulator, innerField) => accumulator[innerField],
            match.teleReefPick
          ) ||
          0 > 0 ||
          innerFields.reduce(
            (accumulator, innerField) => accumulator[innerField],
            match.autoReefPick
          ) ||
          0 > 0
        );
      }).length,
      this.matches.length
    );
  }

  getCollectionPercentage(collection: keyof Collection) {
    return Percent.fromRatio(
      this.matches.filter((match) => match.endgameCollection[collection])
        .length,
      this.matches.length
    );
  }

  getAverageMiddleAuto(): number {
    const middleMatches = this.matches.filter(
      (match) => match.gameSide === "middle"
    );

    if (middleMatches.length === 0) {
      return 0;
    }
    return (
      middleMatches.reduce(
        (accumulator, match) =>
          accumulator +
          match.autoReefPick.algea.netScore +
          match.autoReefPick.algea.processor +
          match.autoReefPick.levels.L1.score +
          match.autoReefPick.levels.L2.score +
          match.autoReefPick.levels.L3.score +
          match.autoReefPick.levels.L4.score,
        0
      ) / middleMatches.length
    );
  }

  getMiddleQuals() {
    return this.matches
      .filter((match) => match.gameSide === "middle")
      .map((match) => TeamData.stringedQual(match.qual));
  }
}
