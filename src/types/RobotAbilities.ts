import { GBForm } from "../utils/GBForm.js";
import { GBScoutForm } from "./GBScoutForm.js";
import { InsureBasis } from "./TypeUtils.js";

const defaultAbility = { succeeded: 0, failed: 0 };
type Ability = typeof defaultAbility;

export const defaultRobotAbilities = {
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

type RobotAbilities = InsureBasis<
  typeof defaultRobotAbilities,
  Record<string, Ability>
>;

type RawRobotAbilities = Record<keyof RobotAbilities, number>;

export const addRobotAbilities = (
  baseAbilities: RobotAbilities,
  robotForm: GBScoutForm
) => {
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

  function addAbilities(ability1: Ability, ability2: Ability): Ability {
    return {
      succeeded: ability1.succeeded + ability2.succeeded,
      failed: ability1.failed + ability2.failed,
    };
  }

  const newAbilties = Object.entries(abilitiesRaw)
    .map(([key, value]) => ({
      [key]: addAbilities(
        getAsAbility(value),
        baseAbilities[key as keyof RobotAbilities]
      ),
    }))
    .reduce((acc, item) => ({ ...acc, ...item }), {});

  return newAbilties as unknown as RobotAbilities;
};
