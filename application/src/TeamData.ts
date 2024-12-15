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
          return {};
        }
        return { [match.Qual + ""]: match[field] };
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
  ): number {
    if (this.matches.length === 0) {
      return 0;
    }
    const bothSummed = this.matches
      .map((match) => {
        if (
          typeof match[percentField] !== "number" ||
          typeof match[compareField] !== "number"
        ) {
          return { percent: 0, compare: 0 };
        }
        return { percent: match[percentField], compare: match[compareField] };
      })
      .reduce((accumulator, value) => {
        return {
          percent: accumulator.percent + value.percent,
          compare: accumulator.compare + value.compare,
        };
      });
    return bothSummed.percent / (bothSummed.compare + bothSummed.percent) * 100;
  }

  getAsPie(
    field: keyof FullMatch,
    colorMap: Record<string, Color>
  ): Record<string, SectionData> {
    const dataSet: Record<string, SectionData> = {};
    Object.entries(this.matches).forEach(([_, match]) => {
      if (typeof match[field] !== "string") {
        return;
      }
      const dataValue = match[field];
      if (!dataSet[dataValue]) {
        dataSet[dataValue] = { numberLabel: 0, color: colorMap[dataValue] };
      }
      dataSet[dataValue].numberLabel++;
    });
    return dataSet;
  }
}
