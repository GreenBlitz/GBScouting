import { MatchType } from "./Match";

interface ScoutForm {
  scouterName: string;
  matchNumber: number;
  matchType: MatchType;
  teamNumber: number;
}

export const dummyForm: ScoutForm = {
  scouterName: "John Doe",
  matchNumber: 1,
  matchType: "qual",
  teamNumber: 1234,
};

export default ScoutForm;
