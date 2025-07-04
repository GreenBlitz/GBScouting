import { GBScoutForm } from "./GBScoutForm.js";
import { Constrained } from "./UtilTypes.js";
import * as formUtils from "../utils/GBFormUtils.js";

export const defaultRobotAbility = { succeeded: 0, failed: 0 };
export type RobotAbility = typeof defaultRobotAbility;

export const defaultRobotAbilities = {
  L1: { ...defaultRobotAbility },
  L2: { ...defaultRobotAbility },
  L3: { ...defaultRobotAbility },
  L4: { ...defaultRobotAbility },
  net: { ...defaultRobotAbility },
  processor: { ...defaultRobotAbility },
  algeaReef: { ...defaultRobotAbility },
  defense: { ...defaultRobotAbility },
  deepCage: { ...defaultRobotAbility },
};

export type RobotAbilities = Constrained<
  typeof defaultRobotAbilities,
  Record<string, RobotAbility>
>;

type RawRobotAbilities = Record<keyof RobotAbilities, number>;

export const addRobotAbilities = (
  baseAbilities: RobotAbilities,
  form: GBScoutForm,
): RobotAbilities => {
  const abilitiesRaw: RawRobotAbilities = {
    L1: formUtils.getL1(form),
    L2: formUtils.getBranchLevel(form, "L2"),
    L3: formUtils.getBranchLevel(form, "L3"),
    L4: formUtils.getBranchLevel(form, "L4"),
    net: formUtils.getNet(form),
    processor: formUtils.getProcessor(form),
    algeaReef: Number(form.generalRobotInfo.removedAlgaeFromReef),
    defense: Number(form.generalRobotInfo.playedDefense),
    deepCage: 0,
  };

  const getAsAbility = (amount: number): RobotAbility => ({
    succeeded: Math.sign(amount),
    failed: 1 - Math.sign(amount),
  });

  const addAbilities = (ability1: RobotAbility, ability2: RobotAbility): RobotAbility => ({
    succeeded: ability1.succeeded + ability2.succeeded,
    failed: ability1.failed + ability2.failed,
  });

  const newAbilties: Record<string, RobotAbility> = {};
  Object.entries(abilitiesRaw).forEach(
    ([key, value]) =>
      (newAbilties[key] = addAbilities(
        getAsAbility(value),
        baseAbilities[key as keyof RobotAbilities]
      ))
  );

  return newAbilties as RobotAbilities;
};
