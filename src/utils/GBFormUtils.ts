import { AutoCoralBranch, GBScoutForm } from "../types/GBScoutForm";

export class GBFormUtils {
  public readonly form: Readonly<GBScoutForm>;
  constructor(form: GBScoutForm) {
    this.form = form;
  }

  private getSumFromObject<T extends Record<any, any>>(obj: T) {
    return Object.values(obj).reduce((acc, value) => acc + value, 0);
  }

  getL1() {
    return this.getSumFromObject(this.form.auto.L1) + this.form.teleop.L1;
  }

  getBranchLevel(level: keyof AutoCoralBranch) {
    return (
      Object.values(this.form.auto.branches)
        .map((branch) => branch[level])
        .reduce((acc, branchLevel) => acc + branchLevel, 0) +
      this.form.teleop[level]
    );
  }

  getNet() {
    return this.form.auto.net + this.form.teleop.net;
  }

  getProcessor() {
    return this.form.auto.processor + this.form.teleop.processor;
  }
}
