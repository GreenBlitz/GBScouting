import { Match } from "./Utils";
import { FieldLine, FieldObject, FieldPoint } from "./strategy/charts/MapChart";
import { SectionData } from "./strategy/charts/PieChart";

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
    return this.matches.map((match) => {
      if (typeof match[percentField] !== "number" || typeof match[compareField] !== "number" ) {
        return 0;
      }
      return match[percentField] - match[compareField];
    }).reduce((accumulator, value) => accumulator + value);
  }

  getAsPie(field: keyof FullMatch): Record<string, SectionData> {
    return Object.assign({}, this.matches.map((match) => {
      
    }))
  }
}
