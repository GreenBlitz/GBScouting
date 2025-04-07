import { Point } from "chart.js";
import { Color } from "./Color";
import { Match } from "./Match";

export function rangeArr(rangeStart: number, rangeEnd: number): number[] {
  return Array.from({ length: rangeEnd - rangeStart }).map(
    (_, i) => i + rangeStart
  );
}

export function sortMatches(matches: Match[]) {
  return matches.sort((match1, match2) => {
    if (match1.qual > 100 && match2.qual < 100) {
      return -1;
    } else if (match1.qual < 100 && match2.qual > 100) {
      return 1;
    }
    return match1.qual - match2.qual;
  });
}

export function getDistance(p1: Point, p2: Point) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

export interface DataSet {
  color: Color;
  data: Record<string, number>;
}

export const FRCTeamList: Record<number, string> = {
  1574: "MisCar",
  1576: "Voltrix",
  1577: "Steampunk",
  1690: "Orbit",
  1937: "Elysium",
  1942: "Cinderella Tel-Nof",
  2096: "RoboActive",
  2230: "General Angels",
  2231: "OnyxTronix",
  2630: "Thunderbolts",
  3065: "Jatt High School",
  3075: "Ha-Dream Team",
  3083: "Artemis",
  3211: "The Y Team",
  3316: "D-Bug",
  3339: "BumbleB",
  3388: "Flash in memory of Margarita Gusak",
  4320: "The Joker",
  4338: "Falcons",
  4416: "Skynet",
  4586: "PRIMO",
  4590: "GreenBlitz",
  4661: "Cypher",
  4744: "Ninjas",
  5135: "Black Unicorns",
  5554: "The Poros Robotics",
  5614: "Team Sycamore",
  5635: "Demacia",
  5654: "Phoenix",
  5715: "DRC",
  5928: "MetalBoost",
  5951: "Makers Assemble",
  5987: "Galaxia in memory of David Zohar",
  5990: "TRIGON",
  6104: "Desert Eagles in memory of Yehonatan Maimon",
  6738: "Excalibur",
  6740: "G3 - Glue Gun & Glitter",
  7039: "❌⭕",
  7067: "Team Streak",
  7112: "EverGreen",
  7845: "8BIT",
  8175: "Piece of Mind",
  8223: "Mariners",
  9738: "Ionic Bond",
  9740: "CANBus in memory of Roney Tal",
};

export const FRCTeamArray = Object.entries(FRCTeamList).map(([key, value]) => ({
  id: `${key} ${value}`,  // Combine the key (ID) and value (team name)
  value: Number(key),     // Keep the numeric value for ID
}));

