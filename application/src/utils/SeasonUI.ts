import { Levels } from "../scouter/input-types/reef-levels/ReefPickInput";
import { MatchTeams } from "./Fetches";

export interface Auto {
  qual: number;
  corals: Levels;
  algeaScoring: UsedAlgea;
}

interface AbstractCollection<T> {
  algeaReefCollected: T;
  algeaReefDropped: T;
  algeaGroundCollected: T;

  coralGroundCollected: T;
  coralFeederCollected: T;
}

export type Collection = AbstractCollection<boolean>;
export type NumberedCollection = AbstractCollection<number>;

export interface UsedAlgea {
  netScore: number;
  netMiss: number;
  processor: number;
}

export interface Notes {
  defense: string;
  evasion: string;
  net: string;
  coral: string;
  climb: string;
  driving: string;
  overall: string;
}

export const DCMPMatches: MatchTeams[] = [
  { blueAlliance: [4661, 3316, 4338], redAlliance: [5990, 5951, 5135] },
  { blueAlliance: [4744, 1937, 3339], redAlliance: [3083, 5928, 2630] },
  { blueAlliance: [2231, 3065, 5635], redAlliance: [6738, 4590, 9740] },
  { blueAlliance: [1942, 1576, 5654], redAlliance: [8223, 5987, 6740] },
  { blueAlliance: [3211, 7845, 8175], redAlliance: [4320, 4416, 7067] },
  { blueAlliance: [7039, 3388, 5614], redAlliance: [6104, 2096, 9738] },
  { blueAlliance: [3075, 1574, 7112], redAlliance: [2230, 5554, 4586] },
  { blueAlliance: [5715, 3339, 4661], redAlliance: [1690, 1577, 4590] },
  { blueAlliance: [4338, 5990, 3065], redAlliance: [1576, 2231, 2630] },
  { blueAlliance: [4744, 7067, 5635], redAlliance: [4416, 5654, 9740] },
  { blueAlliance: [6104, 1942, 5928], redAlliance: [7845, 4320, 3316] },
  { blueAlliance: [3211, 5951, 5554], redAlliance: [7039, 6740, 3083] },
  { blueAlliance: [5987, 1577, 3075], redAlliance: [1574, 2096, 8223] },
  { blueAlliance: [5614, 2230, 5715], redAlliance: [4586, 1937, 3388] },
  { blueAlliance: [5135, 1690, 6738], redAlliance: [9738, 7112, 8175] },
  { blueAlliance: [5990, 6104, 2630], redAlliance: [5635, 1576, 4416] },
  { blueAlliance: [2231, 6740, 3316], redAlliance: [3339, 3083, 4320] },
  { blueAlliance: [7845, 9740, 1577], redAlliance: [2096, 4338, 5554] },
  { blueAlliance: [7067, 1574, 1937], redAlliance: [3388, 4661, 1942] },
  { blueAlliance: [8175, 5614, 1690], redAlliance: [3065, 5987, 7039] },
  { blueAlliance: [5928, 7112, 5951], redAlliance: [3075, 3211, 9738] },
  { blueAlliance: [4586, 4590, 8223], redAlliance: [2230, 4744, 5135] },
  { blueAlliance: [6738, 3083, 4338], redAlliance: [5654, 5715, 6104] },
  { blueAlliance: [1937, 4416, 7845], redAlliance: [1574, 5635, 6740] },
  { blueAlliance: [4320, 8175, 5990], redAlliance: [1577, 2096, 3388] },
  { blueAlliance: [1942, 5554, 9738], redAlliance: [1690, 9740, 2231] },
  { blueAlliance: [5135, 3075, 4586], redAlliance: [3065, 5928, 1576] },
  { blueAlliance: [5654, 8223, 4744], redAlliance: [7112, 5715, 5987] },
  { blueAlliance: [7067, 4661, 2630], redAlliance: [3316, 6738, 7039] },
  { blueAlliance: [4590, 2230, 3211], redAlliance: [5614, 3339, 5951] },
  { blueAlliance: [4338, 2231, 1942], redAlliance: [8175, 1577, 4416] },
  { blueAlliance: [3083, 5135, 9738], redAlliance: [7845, 1574, 1690] },
  { blueAlliance: [5635, 4320, 3388], redAlliance: [5987, 4744, 5554] },
  { blueAlliance: [5928, 5715, 6740], redAlliance: [5990, 4661, 7112] },
  { blueAlliance: [9740, 3316, 8223], redAlliance: [1937, 5614, 3211] },
  { blueAlliance: [2630, 4586, 2096], redAlliance: [5951, 6104, 4590] },
  { blueAlliance: [3075, 6738, 2230], redAlliance: [3339, 7039, 5654] },
  { blueAlliance: [1576, 3083, 1577], redAlliance: [7067, 3065, 7845] },
  { blueAlliance: [5135, 3388, 1574], redAlliance: [6740, 4338, 4744] },
  { blueAlliance: [5614, 5635, 5987], redAlliance: [2231, 5928, 4661] },
  { blueAlliance: [4586, 5951, 8175], redAlliance: [2630, 9740, 1937] },
  { blueAlliance: [7039, 4416, 2230], redAlliance: [5715, 9738, 4320] },
  { blueAlliance: [5554, 3339, 3065], redAlliance: [6104, 8223, 7067] },
  { blueAlliance: [5654, 7112, 6738], redAlliance: [2096, 1576, 3316] },
  { blueAlliance: [4590, 5990, 3075], redAlliance: [3211, 1690, 1942] },
  { blueAlliance: [3388, 9740, 5987], redAlliance: [4661, 7845, 5135] },
  { blueAlliance: [9738, 2230, 5928], redAlliance: [5635, 2630, 1577] },
  { blueAlliance: [5715, 1937, 2231], redAlliance: [8175, 6104, 1574] },
  { blueAlliance: [7112, 3083, 7067], redAlliance: [4338, 4320, 4586] },
  { blueAlliance: [2096, 5654, 3211], redAlliance: [3065, 1942, 5951] },
  { blueAlliance: [6740, 3075, 5554], redAlliance: [4744, 5614, 6738] },
  { blueAlliance: [1576, 5990, 7039], redAlliance: [4416, 3339, 4590] },
  { blueAlliance: [1690, 8223, 5635], redAlliance: [3316, 8175, 3388] },
  { blueAlliance: [6104, 5987, 3083], redAlliance: [1577, 7112, 2230] },
  { blueAlliance: [5715, 5135, 2096], redAlliance: [3211, 7067, 2231] },
  { blueAlliance: [2630, 7845, 4338], redAlliance: [1942, 3075, 5614] },
  { blueAlliance: [9738, 6740, 3339], redAlliance: [4586, 4661, 3065] },
  { blueAlliance: [4416, 3316, 5928], redAlliance: [5654, 5554, 4590] },
  { blueAlliance: [4320, 4744, 1576], redAlliance: [5951, 1690, 1937] },
  { blueAlliance: [9740, 7039, 1574], redAlliance: [8223, 6738, 5990] },
  { blueAlliance: [3083, 5635, 1942], redAlliance: [7112, 5135, 5614] },
  { blueAlliance: [2230, 2630, 3339], redAlliance: [6740, 2096, 7845] },
  { blueAlliance: [4416, 3388, 5715], redAlliance: [3065, 3316, 3075] },
  { blueAlliance: [4744, 9738, 4661], redAlliance: [8175, 5654, 4338] },
  { blueAlliance: [5554, 4320, 9740], redAlliance: [4590, 1574, 1576] },
  { blueAlliance: [6738, 4586, 6104], redAlliance: [5987, 3211, 5990] },
  { blueAlliance: [8223, 2231, 5951], redAlliance: [5928, 7067, 1690] },
  { blueAlliance: [1577, 3065, 5135], redAlliance: [1937, 7039, 7112] },
  { blueAlliance: [3339, 1942, 2096], redAlliance: [5635, 4338, 5715] },
  { blueAlliance: [5554, 8175, 1576], redAlliance: [4661, 2230, 3083] },
  { blueAlliance: [1574, 3211, 4320], redAlliance: [3388, 2630, 5654] },
  { blueAlliance: [1690, 6740, 6104], redAlliance: [9740, 5928, 3075] },
  { blueAlliance: [5987, 4590, 7067], redAlliance: [1937, 9738, 5990] },
  { blueAlliance: [5951, 6738, 4416], redAlliance: [1577, 8223, 5614] },
  { blueAlliance: [7845, 2231, 7039], redAlliance: [3316, 4586, 4744] },
];
