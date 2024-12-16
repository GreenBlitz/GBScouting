class Percent {
  public static readonly Multiplier = 100;

  public readonly value: number;
  public readonly opposite: number;

  constructor(value: number) {
    this.value = value;
    this.opposite = Percent.Multiplier - value;
  }

  static fromFraction(value: number): Percent {
    return new Percent(value * this.Multiplier);
  }

  static fromList(list: number[]): Percent[] {
    const sum = list.reduce((accumulator, value) => accumulator + value);
    return list.map((value) => this.fromFraction(value / sum));
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
