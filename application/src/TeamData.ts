import { SectionData } from "./strategy/charts/PieChart";
import { FieldLine, FieldObject, FieldPoint } from "./strategy/charts/MapChart";
import { Color } from "./utils/Color";

interface Comment {
  body: string;
  qual: number;
}

export class TeamData {
  public readonly matches: Record<string, Record<string, string>>;
  [key: string]: any;

  public static readonly matchName = "Qual";
  public static readonly mapName = "CRESCENDO";

  constructor(teamMatches: Record<string, string>[]) {
    this.matches = {};
    teamMatches.forEach((match) => {
      const fieldObjects: FieldObject[] = JSON.parse(
        match[TeamData.mapName + "/Points"]
      );
      const matchNumber = match[TeamData.matchName];
      function countDataFromMap(data: string, succesfulness: boolean) {
        return (
          fieldObjects.filter((fieldObject) => {
            const isLine = (fieldObject as FieldPoint).x === undefined;
            if (isLine) {
              const fieldLine = fieldObject as FieldLine;
              return (
                fieldLine.data === data &&
                fieldObject.successfulness === succesfulness
              );
            }
            return (
              fieldObject.data === data &&
              fieldObject.successfulness === succesfulness
            );
          }).length + ""
        );
      }
      this.matches[matchNumber] = {
        "Speaker Score": countDataFromMap("Speaker", true),
        "Speaker Miss": countDataFromMap("Speaker", false),
        "Pass Successful": countDataFromMap("Pass", true),
        "Pass Unsuccessful": countDataFromMap("Pass", false),
        "Amp Score": match[`${TeamData.mapName}/Amp/Score`],
        "Amp Miss": match[`${TeamData.mapName}/Amp/Miss`],
        "Trap Score": match["Trap"] === "Scored" ? "1" : "0",
        "Trap Miss": match["Trap"] === "Miss" ? "1" : "0",
      };

      Object.entries(match)
        .filter(
          ([key, _]) => key !== TeamData.matchName && key !== TeamData.mapName
        )
        .forEach(([key, value]) => (this.matches[matchNumber][key] = value));
    });
    return new Proxy(this, {
      get: (target, prop) => {
        if (typeof prop === "string" && prop in target.matches) {
          return target.matches[prop];
        }
        return Reflect.get(target, prop);
      },
      set: (target, prop, value) => {
        if (
          typeof prop === "string" &&
          typeof value === "object" &&
          value !== null
        ) {
          target.matches[prop] = value;
          return true;
        }
        return Reflect.set(target, prop, value);
      },
    });
  }

  getAverage(data: string): number {
    let sum = 0;
    const matchesData = Object.values(this.matches);
    matchesData.forEach((match) => {
      sum += parseInt(match[data]);
    });
    return sum > 0 ? sum / matchesData.length : 0;
  }

  getAsLine(data: string): Record<string, number> {
    const dataSet: Record<string, number> = {};
    Object.entries(this.matches).forEach(([qual, match]) => {
      dataSet[qual] = parseInt(match[data]);
    });
    return dataSet;
  }

  getAsPie(
    data: string,
    colorMap: Record<string, Color>
  ): Record<string, SectionData> {
    const dataSet: Record<string, SectionData> = {};
    Object.entries(this.matches).forEach(([_, match]) => {
      const dataValue = match[data];
      if (!dataSet[dataValue]) {
        dataSet[dataValue] = { color: colorMap[dataValue], numberLabel: 0 };
      }
      dataSet[dataValue].numberLabel++;
    });
    return dataSet;
  }

  getAccuracy(data1: string, data2: string) {
    let sum1 = 0;
    let sum2 = 0;
    const matches = Object.values(this.matches);
    matches.forEach((match) => {
      sum1 += parseInt(match[data1]);
      sum2 += parseInt(match[data2]);
    });
    return (sum1 / (sum1 + sum2)) * 100;
  }

  getComments(): Comment[] {
    return Object.values(this.matches).map((match) => {
      return { body: match["Comment"], qual: parseInt(match["Qual"]) };
    });
  }

  getAllFieldObjects(): FieldObject[] {
    let points: FieldObject[] = [];
    Object.values(this.matches).forEach((match) => {
      const mapPoints: FieldObject[] = JSON.parse(
        match[TeamData.mapName + "/Points"]
      );
      points = [...points, ...mapPoints];
    });
    return points;
  }
}
