import { MatchType } from "./Match";

type ScouterInputType = "text" | "number" | "boolean" | "select";

interface ScoutForm {
  scouterName: string;
  matchNumber: number;
  matchType: MatchType;
  teamNumber: number;
}

export const ScouterFormTypes: Record<keyof ScoutForm, ScouterInputType> = {
  scouterName: "text",
  matchNumber: "number",
  matchType: "select",
  teamNumber: "number",
}

export default ScoutForm;
