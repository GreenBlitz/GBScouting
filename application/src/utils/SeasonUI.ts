import { Levels } from "../scouter/input-types/reef-levels/ReefLevelsInput";
import { ReefSide } from "../scouter/input-types/ReefInput";

export interface Auto {
  qual: number;
  corals: Levels;
  algeaScoring: UsedAlgea;
  sides: ReefSide[];
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
