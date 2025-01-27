import { Levels } from "../components/ReefForm";
import { AllSushis } from "../scouter/input-types/auto-map/AutonomousMapInput";

export interface Auto {
  collected: AllSushis;
  feeded: number;
  scored: Levels;
}
