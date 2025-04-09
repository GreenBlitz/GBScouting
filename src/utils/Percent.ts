export default class Percent {
  public static readonly PERCENTAGE_BASE = 100;

  public readonly value: number;
  public readonly complement: number;

  constructor(value: number);
  constructor(value: number, base: number);
  constructor(value: number, base: number = Percent.PERCENTAGE_BASE) {
    this.value = value;
    this.complement = base - value;
  }

  and(other: Percent): Percent {
    return new Percent(this.value * other.value);
  }

  or(other: Percent): Percent {
    return new Percent(this.value + other.value - this.and(other).value);
  }

  static fromRatio(numerator: number, denominator: number): Percent {
    if (denominator === 0) {
      return new Percent(0);
    }
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

  static iteratorFunction<T>(
    toList: (enumerable: T) => number[],
    fromList: (percents: Percent[]) => T
  ) {
    return (enumerable: T): T => {
      const list = toList(enumerable);
      const sum = list.reduce((accumulator, value) => accumulator + value);
      const percents = list.map((value) => this.fromRatio(value, sum));
      return fromList(percents);
    };
  }
}
