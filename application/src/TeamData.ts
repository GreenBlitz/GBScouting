import { Color } from "./utils/Color";
import { Match } from "./utils/Utils";
import { SectionData } from "./strategy/charts/PieChart";
import Percent from "./utils/Percent";
import { FieldObject } from "./scouter/inputtypes/MapInput";

interface Comment {
  body: string;
  qual: number;
}

interface MapFields {
  speakerScore: number;
  speakerMiss: number;

  passSuccessful: number;
  passFail: number;
}

type FullMatch = Match & MapFields;

export class TeamData {
  private matches: FullMatch[];

  constructor(matches: Match[]) {
    function getFromMap(match: Match, name: string, successfulness: boolean) {
      return match.mapPoints.filter(
        (object) =>
          object.pressedButton.name === name &&
          object.successfulness === successfulness
      ).length;
    }
    this.matches = matches.map((match) => {
      return {
        ...match,
        speakerScore: getFromMap(match, "Speaker", true),
        speakerMiss: getFromMap(match, "Speaker", false),
        passSuccessful: getFromMap(match, "Pass", true),
        passFail: getFromMap(match, "Pass", false),
      };
    });
  }

  getAsLine(field: keyof FullMatch): Record<string, number> {
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

  getAllFieldObjects(): FieldObject[] {
    return this.matches.map((match) => match.mapPoints).flat();
  }

  getComments(): Comment[] {
    return this.matches.map((match) => {
      return { body: match.comment, qual: match.qual };
    });
  }

  getAccuracy(
    percentField: keyof FullMatch,
    compareField: keyof FullMatch
  ): Percent {
    const averages = [
      this.getAverage(percentField),
      this.getAverage(compareField),
    ];
    return Percent.fromList(averages)[0];
  }

  getAverage(field: keyof FullMatch): number {
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
    field: keyof FullMatch,
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
