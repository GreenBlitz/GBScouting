import { AllScore } from "../components/TeleopForm";
import { AllSushis } from "../scouter/input-types/auto-map/AutonomousMapInput";

export interface Auto {
  collected: AllSushis;
  feeded: number;
  scored: AllScore;
}
