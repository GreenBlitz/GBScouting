import { GBForm } from "../utils/GBForm.js";
import { GBScoutForm } from "./GBScoutForm.js";

export interface RobotAbilities {
  L1: Ability;
  L2: Ability;
  L3: Ability;
  L4: Ability;
  net: Ability;
  processor: Ability;
  algeaReef: Ability;
  defense: Ability;
  deepCage: Ability;
}

interface Ability {
  succeeded: number;
  failed: number;
}

const defaultAbility: Ability = { succeeded: 0, failed: 0 };
export const defaultRobotAbilities: RobotAbilities = {
  L1: { ...defaultAbility },
  L2: { ...defaultAbility },
  L3: { ...defaultAbility },
  L4: { ...defaultAbility },
  net: { ...defaultAbility },
  processor: { ...defaultAbility },
  algeaReef: { ...defaultAbility },
  defense: { ...defaultAbility },
  deepCage: { ...defaultAbility },
};

type RawRobotAbilities = Record<keyof RobotAbilities, number>;

export const getRobotAbilities = (robotForm: GBScoutForm) => {
  const form = new GBForm(robotForm);
  const abilitiesRaw: RawRobotAbilities = {
    L1: form.getL1(),
    L2: form.getBranchLevel("L2"),
    L3: form.getBranchLevel("L3"),
    L4: form.getBranchLevel("L4"),
    net: form.getNet(),
    processor: form.getProcessor(),
    algeaReef: Number(form.scoutForm.generalRobotInfo.removedAlgaeFromReef),
    defense: Number(form.scoutForm.generalRobotInfo.playedDefense),
    deepCage: 0,
  };

  function getAsAbility(amount: number): Ability {
    return {
      succeeded: Math.sign(amount),
      failed: 1 - Math.sign(amount),
    };
  }

  const abilities = Object.entries(abilitiesRaw)
    .map(([key, value]) => ({ [key]: getAsAbility(value) }))
    .reduce((acc, item) => ({ ...acc, ...item }), {});

  return abilities as unknown as RobotAbilities;
};

export const mergeRobotAbilities = (
  abilities1: RobotAbilities,
  abilities2: RobotAbilities
) => {
  const abilities = Object.keys(abilities1)
    .map((key) => {
      const actualKey = key as keyof RobotAbilities;
      const ability: Ability = {
        succeeded:
          abilities1[actualKey].succeeded + abilities2[actualKey].succeeded,
        failed: abilities1[actualKey].failed + abilities2[actualKey].failed,
      };
      return { [actualKey]: ability };
    })
    .reduce((acc, item) => ({ ...acc, ...item }), {});

  return abilities as unknown as RobotAbilities;
};
