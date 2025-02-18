import { Point } from "chart.js";
import { Color } from "./Color";
import { Match } from "./Match";

export function rangeArr(rangeStart: number, rangeEnd: number): number[] {
  return Array.from({ length: rangeEnd - rangeStart }).map(
    (_, i) => i + rangeStart
  );
}

export function sortMatches(matches: Match[]) {
  return matches.sort((match1, match2) => match1.qual - match2.qual);
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
  1580: "Blue Monkeys",
  1657: "Hamosad",
  1690: "Orbit",
  1937: "Elysium",
  1942: "Cinderella",
  1943: "Neat Team",
  1954: "ElectroBunny",
  2096: "RoboActive",
  2212: "The Spikes",
  2230: "General Angels",
  2231: "OnyxTronix",
  2630: "Thunderbolts",
  2679: "Atlantis",
  3034: "Galileo",
  3065: "Jatt",
  3075: "Ha-Dream Team",
  3083: "Artemis",
  3211: "The Y Team",
  3316: "D-Bug",
  3339: "BumbleB",
  3388: "Flash",
  3835: "Vulcan",
  4319: "Ladies FIRST",
  4320: "The Joker",
  4338: "Falcons",
  4416: "Skynet",
  4586: "PRIMO",
  4590: "GreenBlitz",
  4661: "Cypher",
  4744: "Ninjas",
  5135: "Black Unicorns",
  5291: "Emperius",
  5554: "The Poros",
  5614: "Sycamore",
  5635: "Demacia",
  5654: "Phoenix",
  5715: "DRC",
  5747: "Athena",
  5928: "MetalBoost",
  5951: "Makers Assemble",
  5987: "Galaxia",
  5990: "TRIGON",
  6049: "Pegasus",
  6104: "Desert Eagles",
  6168: "alzahrawi",
  6230: "Team Koi",
  6738: "Excalibur",
  6740: "G3",
  6741: "Space monkeys",
  7039: "❌⭕",
  7067: "Team Streak",
  7112: "EverGreen",
  7177: "Amal tayibe",
  7554: "Green Rockets",
  7845: "8BIT",
  8175: "Piece of Mind",
  8223: "Mariners",
  8843: "Amal Space",
  9303: "PO®️TAL",
  9304: "legend's",
  9738: "Ionic Bond",
  9739: "Firefly",
  9740: "CAN://Bus",
  9741: "STORM",
  10139: "Tsunami",
  10695: "Galileo",
};
