import { Levels } from "../scouter/input-types/reef-levels/ReefLevelsInput";

export interface Auto {
  qual: number;
  corals: Levels;
  algeaScoring: UsedAlgea;
}

export interface Collection {
  algeaReefCollected: boolean;
  algeaReefDropped: boolean;
  algeaGroundCollected: boolean;

  coralGroundCollected: boolean;
  coralFeederCollected: boolean;
}

export interface UsedAlgea {
  netScore: number;
  netMiss: number;
  processor: number;
}
