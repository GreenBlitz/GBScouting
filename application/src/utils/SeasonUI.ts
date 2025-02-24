import { Levels } from "../scouter/input-types/reef-levels/ReefPickInput";

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

export const currentDistrict = "2025isde2";
