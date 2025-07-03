import { AutoCoralBranch, GBScoutForm } from "../types/GBScoutForm.js";

const getSumFromObject = <T extends Record<any, any>>(obj: T) =>
  Object.values(obj).reduce((acc, value) => acc + value, 0);

export const getL1 = (scoutForm: GBScoutForm) =>
  getSumFromObject(scoutForm.auto.L1) + scoutForm.teleop.L1;

export const getBranchLevel = (
  scoutForm: GBScoutForm,
  level: keyof AutoCoralBranch
) =>
  Object.values(scoutForm.auto.branches)
    .map((branch) => branch[level])
    .reduce((acc, branchLevel) => acc + branchLevel, 0) +
  scoutForm.teleop[level];

export const getNet = (scoutForm: GBScoutForm) =>
  scoutForm.auto.net + scoutForm.teleop.net;

export const getProcessor = (scoutForm: GBScoutForm) =>
  scoutForm.auto.processor + scoutForm.teleop.processor;
