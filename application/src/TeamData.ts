import { Match } from "./Utils";
import { FieldLine, FieldObject, FieldPoint } from "./strategy/charts/MapChart";
import { SectionData } from "./strategy/charts/PieChart";
import { Color } from "./utils/Color";

interface Comment {
  body: string;
  qual: number;
}

interface MapFields {
  SpeakerScore: number;
  SpeakerMiss: number;

  PassSuccessful: number;
  PassUnSuccessful: number;
}

type FullMatch = Match & MapFields;

export class TeamData {
  private matches: FullMatch[];

  static exampleData: TeamData = new TeamData([
    {
      ScouterName: "Yoni",
      Qual: 1,
      TeamNumber: 4590,
      GameSide: "Blue",
      StartingPosition: "Amp Side",
      SpeakerAutoScore: 3,
      SpeakerAutoMiss: 4,
      MapPoints: [{ x: 100, y: 300, successfulness: true, data: "Speaker" }],
      AmpScore: 2,
      AmpMiss: 1,
      Climb: "Park",
      Trap: "Scored",
      Comment: "lol",
    },
  ]);

  constructor(matches: Match[]) {
    function getFromMap(match: Match, name: string, successfulness: boolean) {
      return match.MapPoints.filter(
        (object) =>
          object.data === name && object.successfulness === successfulness
      ).length;
    }
    this.matches = matches.map((match) => {
      return {
        ...match,
        SpeakerScore: getFromMap(match, "Speaker", true),
        SpeakerMiss: getFromMap(match, "Speaker", false),
        PassSuccessful: getFromMap(match, "Pass", true),
        PassUnSuccessful: getFromMap(match, "Pass", false),
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
        return { [match.Qual.toString()]: match[field] };
      })
    );
  }

  getAllFieldObjects(): FieldObject[] {
    return this.matches.map((match) => match.MapPoints).flat();
  }

  getComments(): Comment[] {
    return this.matches.map((match) => {
      return { body: match.Comment, qual: match.Qual };
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
          throw new Error("Invalid Field: " + field);
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
        throw new Error("Invalid Field: " + field);
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
