import { GBScoutForm } from "../types/GBScoutForm";
import ISAScoutForm from "../types/ISAScoutForm";

function ISAtoGB(ISAForm: ISAScoutForm): GBScoutForm {
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
      removedAlgaeFromReef: Boolean(ISAForm.removedAlgaeFromReef),
      comments: ISAForm.comments,
    },
    eventInfo: {
      eventKey: ISAForm.eventKey,
      matchLevel: ISAForm.matchLevel,
    },
    goodAt: {
      coralL1: Boolean(ISAForm.goodAtCoralL1),
      coralL2: Boolean(ISAForm.goodAtCoralL2),
      coralL3: Boolean(ISAForm.goodAtCoralL3),
      coralL4: Boolean(ISAForm.goodAtCoralL4),
      algaeNet: Boolean(ISAForm.goodAtAlgaeNet),
      algaeProcessor: Boolean(ISAForm.goodAtAlgaeProcessor),
      climb: Boolean(ISAForm.goodAtClimb),
      defense: Boolean(ISAForm.goodAtDefense),
      workingWithAlliance: Boolean(ISAForm.goodAtWorkingWithAlliance),
      driving: Boolean(ISAForm.goodAtDriving),
      auto: Boolean(ISAForm.goodAtAuto),
    },
    auto: {
      branches: {
        A: {
          L2: Boolean(ISAForm.autoCoralAL2),
          L3: Boolean(ISAForm.autoCoralAL3),
          L4: Boolean(ISAForm.autoCoralAL4),
        },
        B: {
          L2: Boolean(ISAForm.autoCoralBL2),
          L3: Boolean(ISAForm.autoCoralBL3),
          L4: Boolean(ISAForm.autoCoralBL4),
        },
        C: {
          L2: Boolean(ISAForm.autoCoralCL2),
          L3: Boolean(ISAForm.autoCoralCL3),
          L4: Boolean(ISAForm.autoCoralCL4),
        },
        D: {
          L2: Boolean(ISAForm.autoCoralDL2),
          L3: Boolean(ISAForm.autoCoralDL3),
          L4: Boolean(ISAForm.autoCoralDL4),
        },
        E: {
          L2: Boolean(ISAForm.autoCoralEL2),
          L3: Boolean(ISAForm.autoCoralEL3),
          L4: Boolean(ISAForm.autoCoralEL4),
        },
        F: {
          L2: Boolean(ISAForm.autoCoralFL2),
          L3: Boolean(ISAForm.autoCoralFL3),
          L4: Boolean(ISAForm.autoCoralFL4),
        },
        G: {
          L2: Boolean(ISAForm.autoCoralGL2),
          L3: Boolean(ISAForm.autoCoralGL3),
          L4: Boolean(ISAForm.autoCoralGL4),
        },
        H: {
          L2: Boolean(ISAForm.autoCoralHL2),
          L3: Boolean(ISAForm.autoCoralHL3),
          L4: Boolean(ISAForm.autoCoralHL4),
        },
        I: {
          L2: Boolean(ISAForm.autoCoralIL2),
          L3: Boolean(ISAForm.autoCoralIL3),
          L4: Boolean(ISAForm.autoCoralIL4),
        },
        J: {
          L2: Boolean(ISAForm.autoCoralJL2),
          L3: Boolean(ISAForm.autoCoralJL3),
          L4: Boolean(ISAForm.autoCoralJL4),
        },
        K: {
          L2: Boolean(ISAForm.autoCoralKL2),
          L3: Boolean(ISAForm.autoCoralKL3),
          L4: Boolean(ISAForm.autoCoralKL4),
        },
        L: {
          L2: Boolean(ISAForm.autoCoralLL2),
          L3: Boolean(ISAForm.autoCoralLL3),
          L4: Boolean(ISAForm.autoCoralLL4),
        },
      },
      L1: {
        AB: ISAForm.autoCoralABL1,
        CD: ISAForm.autoCoralCDL1,
        EF: ISAForm.autoCoralEFL1,
        GH: ISAForm.autoCoralGHL1,
        IJ: ISAForm.autoCoralIJL1,
        KL: ISAForm.autoCoralKLL1,
      },
      autoProcessor: ISAForm.autoProcessor,
      autoNet: ISAForm.autoNet,
      leave: Boolean(ISAForm.autoCrossedRSL),
    },
    teleop: {
      L1: ISAForm.teleopL1,
      L2: ISAForm.teleopL2,
      L3: ISAForm.teleopL3,
      L4: ISAForm.teleopL4,
      Processor: ISAForm.teleopProcessor,
      Net: ISAForm.teleopNet,
      AttemptedPark: Boolean(ISAForm.teleopPark),
      AttemptedShallow: Boolean(ISAForm.teleopAttemptedShallow),
      AttemptedDeep: Boolean(ISAForm.teleopAttemptedDeep),
    },
  };
}
export default ISAtoGB;