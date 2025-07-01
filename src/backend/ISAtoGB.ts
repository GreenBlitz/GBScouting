import { GBScoutForm } from "../types/GBScoutForm";
import ISAScoutForm from "../types/ISAScoutForm";

export function ISAtoGB(ISAForm: ISAScoutForm): GBScoutForm {
  return {
    deviceInfo: {
      teamNumber: ISAForm.deviceTeamNumber,
      id: ISAForm.deviceId,
      scoutTeamNumber: ISAForm.scoutTeamNumber,
      scoutName: ISAForm.scoutName,
    },
    preMatch: {
      flag: ISAForm.flag,
      noShow: Boolean(ISAForm.noShow),
      startingLocation: Boolean(ISAForm.startingLocationA)
        ? "A"
        : Boolean(ISAForm.startingLocationB)
        ? "B"
        : "C",
      died: Boolean(ISAForm.died),
      matchNumber: ISAForm.matchNumber,
      teamNumber: ISAForm.teamNumber,
      alliance: ISAForm.alliance === "Red" ? "Red" : "Blue",
      robotNumber: 0,
    },
    generalRobotInfo: {
      playedDefense: Boolean(ISAForm.playedDefense),
      removedAlgaeFromReef: 0,
      comments: "",
    },
    eventInfo: undefined,
    goodAt: undefined,
    autoCoral: undefined,
    teleop: undefined,
  };
}
