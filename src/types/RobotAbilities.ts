import { GBForm } from "../utils/GBForm.js";
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
  form: GBForm
) => {
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
