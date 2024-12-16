import { Point } from "chart.js";
import Inputs from "./scouter/Inputs";
import ScouterInput from "./scouter/ScouterInput";

export const getServerHostname = () => {
  return location.host;
};

export async function fetchData(field: string);
export async function fetchData(field: string, method: string, body: string);
export async function fetchData(
  field: string,
  method: string = "GET",
  body?: string
) {
  return await fetch(`https://${getServerHostname()}/${field}`, {
    method: method,
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

export function rangeArr(rangeStart: number, rangeEnd: number): number[] {
  return Array.from({ length: rangeEnd - rangeStart }).map(
    (_, i) => i + rangeStart
  );
}

export async function getMatchesByCriteria(field?: string, value?: string) {
  const searchedField = field && value ? `${field}/${value}` : ``;
  return await fetchData("Matches/" + searchedField);
}

export function sortMatches(matches: Match[]) {
  return matches.sort((match1, match2) => match1.Qual - match2.Qual);
}

export type Match = Omit<
  {
    [K in keyof typeof Inputs]: (typeof Inputs)[K] extends ScouterInput<
      infer U,
      any,
      any
    >
      ? U
      : never;
  },
  "prototype" | "instantiate"
>;

export interface Note extends Point {
  color: "green" | "red" | "orange";
}

export const autoNotePositions: Point[] = [250, 200, 150, 100, 50].map(
  (height) => {
    return { x: 280, y: height };
  }
);
export const autoBlueNotePositions: Point[] = [150, 100, 50].map((height) => {
  return { x: 90, y: height };
});

export const FRCTeamList = [
  "1574\tMisCar",
  "1576\tVoltrix",
  "1577\tSteampunk",
  "1580\tThe Blue Monkeys",
  "1657\tHamosad",
  "1690\tOrbit",
  "1937\tElysium",
  "1942\tCinderella Tel-Nof",
  "1943\tNeat Team",
  "1954\tElectroBunny",
  "2096\tRoboActive",
  "2212\tThe Spikes",
  "2230\tGeneral Angels",
  "2231\tOnyxTronix",
  "2630\tThunderbolts",
  "2679\tAtlantis",
  "3034\tGalileo",
  "3065\tJatt High School",
  "3075\tHa-Dream Team",
  "3083\tArtemis",
  "3211\tThe Y Team",
  "3316\tD-Bug",
  "3339\tBumbleB",
  "3388\tFlash in memory of Margarita Gusak",
  "3835\tVulcan",
  "4319\tLadies FIRST",
  "4320\tThe Joker",
  "4338\tFalcons",
  "4416\tSkynet",
  "4586\tPRIMO",
  "4590\tGreenBlitz",
  "4661\tCypher",
  "4744\tNinjas",
  "5135\tBlack Unicorns",
  "5291\tEmperius",
  "5554\tThe Poros Robotics",
  "5614\tTeam Sycamore",
  "5635\tDemacia",
  "5654\tPhoenix",
  "5715\tDRC",
  "5747\tAthena",
  "5928\tMetalBoost",
  "5951\tMakers Assemble",
  "5987\tGalaxia in memory of David Zohar",
  "5990\tTRIGON",
  "6049\tPegasus",
  "6104\tDesert Eagles",
  "6168\talzahrawi",
  "6230\tTeam Koi",
  "6738\tExcalibur",
  "6740\tG3 - Glue Gun & Glitter",
  "6741\tSpace monkeys",
  "7039\t❌⭕",
  "7067\tTeam Streak",
  "7112\tEverGreen",
  "7177\tAmal tayibe",
  "7554\tGreen Rockets",
  "7845\t8BIT",
  "8175\tPiece of Mind",
  "8223\tMariners",
  "8843\tAmal Space and Aviation Maale Adumim",
  "9303\tPO®️TAL to GOATland",
  "9304\tlegend's",
  "9738\tIonic Bond",
  "9739\tFirefly",
  "9740\tCAN://Bus",
  "9741\tSTORM",
  "9985\tOff-Season Demo Team 9986",
  "9986\tOff-Season Demo Team 9986",
  "9987\tOff-Season Demo Team 9986",
  "9988\tOff-Season Demo Team 9986",
  "9989\tOff-Season Demo Team 9986",
  "9990\tOff-Season Demo Team 9986",
  "9991\tOff-Season Demo Team 9986",
  "9992\tOff-Season Demo Team 9986",
  "9993\tOff-Season Demo Team 9986",
  "9994\tOff-Season Demo Team 9986",
  "9995\tOff-Season Demo Team 9986",
  "9996\tOff-Season Demo Team 9986",
  "9997\tOff-Season Demo Team 9986",
  "9998\tOff-Season Demo Team 9986",
  "9999\tOff-Season Demo Team 9986",
];
