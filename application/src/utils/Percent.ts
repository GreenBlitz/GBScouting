export default class Percent {
  public static readonly PERCENTAGE_BASE = 100;

  public readonly value: number;
  public readonly complement: number;

  constructor(value: number) {
    this.value = value;
    this.complement = Percent.PERCENTAGE_BASE - value;
  }

  static fromRatio(numerator: number, denominator: number): Percent {
    return new Percent((numerator * this.PERCENTAGE_BASE) / denominator);
  }

  static fromList(list: number[]): Percent[] {
    const sum = list.reduce((accumulator, value) => accumulator + value);
    return list.map((value) => this.fromRatio(value, sum));
  }

  static fromRecord(record: Record<string, number>): Record<string, Percent> {
    const percentList = this.fromList(Object.values(record));
    return Object.assign(
      {},
      ...Object.keys(record).map((key, index) => {
        return { [key]: percentList[index] };
      })
    );
  }
}
