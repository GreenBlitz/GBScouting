import { rangeArr } from "../Utils"

export class BitArray {
  boolArr: boolean[];
  bitCount: number;

  constructor(arr?: Uint8Array) {
    this.bitCount = 0;
    this.boolArr = [];
    if (arr) {
      this.insert(arr, arr.length * 8);
    }
  }

  insert(data: Uint8Array, totalBitCount: number): void;
  insert(bitArray: BitArray): void;
  insert(data: BitArray | Uint8Array, totalBitCount?: number) {
    function insertBitArray(bitArr1: BitArray, bitArr2: BitArray) {
      bitArr1.boolArr = bitArr1.boolArr.concat(bitArr2.boolArr);
      bitArr1.bitCount += bitArr2.bitCount;
    }
    function insertBits(bitArr: BitArray, data: Uint8Array, bitCount: number) {
      rangeArr(0, bitCount).forEach((i) => {
        bitArr.boolArr.push((data[Math.floor(i / 8)] & (1 << i % 8)) !== 0);
      });
      bitArr.bitCount += bitCount;
    }

    if (totalBitCount !== undefined) {
      insertBits(this, data as Uint8Array, totalBitCount);
    } else {
      insertBitArray(this, data as BitArray);
    }
  }

  consumeBits(bitCount: number): Uint8Array {
    let returnedArr = new Uint8Array(Math.ceil(bitCount / 8));
    rangeArr(0, bitCount).forEach((i) => {
      returnedArr[Math.floor(i / 8)] |= (this.boolArr.shift() ? 1 : 0) << i % 8;
    });
    this.bitCount -= bitCount;
    return returnedArr;
  }

  insertBool(bool: boolean) {
    this.boolArr.push(bool);
    this.bitCount++;
  }

  consumeBool(): boolean {
    this.bitCount--;
    return this.boolArr.shift() as boolean;
  }

  consume(): Uint8Array {
    return this.consumeBits(this.bitCount);
  }
}
