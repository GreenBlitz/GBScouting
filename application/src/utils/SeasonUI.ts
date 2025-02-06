import { Levels } from "../components/teleopForm";
import { ReefSide } from "../scouter/input-types/ReefInput";

export interface Auto {
  corals: Levels;
  usedSides: ReefSide[];
  algeaCollection: CollectedAlgea;
  algeaScoring: UsedAlgea;
}

export interface CollectedAlgea {
  reefCollected: boolean;
  reefDropped: boolean;
  groundCollected: boolean;
}

export interface UsedAlgea {
  netScore: number;
  netMiss: number;
  processor: number;
}