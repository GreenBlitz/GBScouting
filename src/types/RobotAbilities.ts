import { GBScoutForm } from "./GBScoutForm.js";
import { Constrained } from "./UtilTypes.js";
import * as formUtils from "../utils/GBFormUtils.js";

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

export type RobotAbilities = Constrained<
  typeof defaultRobotAbilities,
  Record<string, Ability>
>;

type RawRobotAbilities = Record<keyof RobotAbilities, number>;

export const addRobotAbilities = (
  baseAbilities: RobotAbilities,
  form: GBScoutForm
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

  const getAsAbility = (amount: number): Ability => ({
    succeeded: Math.sign(amount),
    failed: 1 - Math.sign(amount),
  });

  const addAbilities = (ability1: Ability, ability2: Ability): Ability => ({
    succeeded: ability1.succeeded + ability2.succeeded,
    failed: ability1.failed + ability2.failed,
  });

  const newAbilties: Record<string, Ability> = {};
  Object.entries(abilitiesRaw).forEach(
    ([key, value]) =>
      (newAbilties[key] = addAbilities(
        getAsAbility(value),
        baseAbilities[key as keyof RobotAbilities]
      ))
  );

  return newAbilties as RobotAbilities;
};
