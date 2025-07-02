import { AutoCoralBranch, GBScoutForm } from "../types/GBScoutForm";

export class GBForm {
  public readonly scoutForm: Readonly<GBScoutForm>;
  constructor(scoutForm: GBScoutForm) {
    this.scoutForm = scoutForm;
  }

  private getSumFromObject<T extends Record<any, any>>(obj: T) {
    return Object.values(obj).reduce((acc, value) => acc + value, 0);
  }

  getL1() {
    return (
      this.getSumFromObject(this.scoutForm.auto.L1) + this.scoutForm.teleop.L1
    );
  }

  getBranchLevel(level: keyof AutoCoralBranch) {
    return (
      Object.values(this.scoutForm.auto.branches)
        .map((branch) => branch[level])
        .reduce((acc, branchLevel) => acc + branchLevel, 0) +
      this.scoutForm.teleop[level]
    );
  }

  getNet() {
    return this.scoutForm.auto.net + this.scoutForm.teleop.net;
  }

  getProcessor() {
    return this.scoutForm.auto.processor + this.scoutForm.teleop.processor;
  }
}
