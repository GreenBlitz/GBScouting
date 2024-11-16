function rangeArr(rangeStart: number, rangeEnd: number): number[] {
  return Array(rangeEnd - rangeStart)
    .fill(0)
    .map((_, i) => i + rangeStart);
}

class BitArray {
  boolArr: Array<boolean>;
  bitCount: number;

  constructor(arr?: Uint8Array) {
    this.bitCount = 0;
    this.boolArr = new Array();
    if (arr !== undefined) {
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

// TODO add signed support!
function serdeUnsignedNum(bitCount: number): Serde {
  const bits = bitCount;
  function serializer(serialiedData: BitArray, num: number) {
    let arr = new BitArray();

    for (let i = 0; i < bits; i++) {
      arr.insertBool(num % 2 === 1);
      num = Math.floor(num / 2);
    }
    serialiedData.insert(arr);
  }
  function deserializer(serializedData: BitArray): number {
    let num = 0;

    for (let i = 0; i < bits; i++) {
      num += Math.pow(2, i) * (serializedData.consumeBool() ? 1 : 0);
    }
    return num;
  }
  return {
    serializer,
    deserializer,
  };
}

function serdeStringifiedNum(bitCount: number): Serde {
  const bits = bitCount;
  function serializer(seriailzedData: BitArray, num: string) {
    return serdeUnsignedNum(bits).serializer(seriailzedData, Number(num));
  }
  function deserializer(seriailzedData: BitArray): string {
    return serdeUnsignedNum(bits).deserializer(seriailzedData).toString();
  }
  return {
    serializer,
    deserializer,
  };
}

function serdeString(): Serde {
  const STRING_LENGTH_BIT_COUNT: number = 4 * 8;
  function serializer(serializedData: BitArray, string: string) {
    const encodedString: Uint8Array = new TextEncoder().encode(string);

    serdeUnsignedNum(STRING_LENGTH_BIT_COUNT).serializer(
      serializedData,
      encodedString.length
    );
    serializedData.insert(encodedString, encodedString.length * 8);
  }
  function deserializer(serializedData: BitArray): string {
    let encodedStringLength = serdeUnsignedNum(STRING_LENGTH_BIT_COUNT).deserializer(
      serializedData
    );
    let encodedString = serializedData.consumeBits(encodedStringLength * 8);
    return new TextDecoder().decode(encodedString);
  }
  return {
    serializer,
    deserializer,
  };
}

type Serializer = (seriailzedData: BitArray, data: any) => void;
// return field name, and its appropriate Serializer
type RecordSerializer = Record<string, Serializer>;

// returns the deserializedData
type Deserializer = (serializedData: BitArray) => any;
// return field name, and its appropriate Deserializer
type RecordDeserializer = Record<string, Deserializer>;

type FieldsRecordSerde = {
  serializer: RecordSerializer;
  deserializer: RecordDeserializer;
};
interface Serde{
  serializer: Serializer;
  deserializer: Deserializer;
}

function serdeOptionalFieldsRecord(fieldsSerde: FieldsRecordSerde) :Serde {
  function fieldsExistenceBitCount(
    fields: RecordSerializer | RecordDeserializer
  ): number {
    return Object.keys(fields).length;
  }
  function serializer(
    serializedData: BitArray,
    fieldsSerializers: RecordSerializer,
    data: Record<string, any>
  ) {
    let fieldsExistenceArray = new BitArray();
    let serializedFields = new BitArray();

    for (const fieldIndex in Object.keys(fieldsSerializers)) {
      let field = Object.keys(fieldsSerializers)[fieldIndex];
      try {
        let fieldValue = Reflect.get(data, field);
        if (fieldValue == undefined) {
          fieldsExistenceArray.insertBool(false);
          continue;
        }
        fieldsExistenceArray.insertBool(true);
        fieldsSerializers[field](serializedFields, fieldValue);
      } catch (error) {
        fieldsExistenceArray.insertBool(false);
      }
    }
    serializedData.insert(fieldsExistenceArray);
    serializedData.insert(serializedFields);
  }
  function deserializer(
    fieldsDeserializers: RecordDeserializer,
    serializedData: BitArray
  ): Record<string, any> {
    let data: Record<string, any> = {};

    let fieldsExistence: boolean[] = rangeArr(0, fieldsExistenceBitCount(fieldsDeserializers)).reduce<boolean[]>((accumulator, _) => accumulator.concat([serializedData.consumeBool()]), []);

    const deserializersKeys = Object.keys(fieldsDeserializers);
    for (let i = 0; i < deserializersKeys.length; i++) {
      if (!fieldsExistence[i]) {
        continue;
      }
      const field = deserializersKeys[i];
      let fieldData =
        fieldsDeserializers[field](serializedData);
      Reflect.set(data, field, fieldData);
    }
    return data;
  }
  return {
    serializer: function(serializedData, data) {
      return serializer(serializedData, fieldsSerde.serializer, data);
    },
    deserializer: function(serializedData) {
      return deserializer(fieldsSerde.deserializer, serializedData);
    },
  };
}

export function serdeRecord(fieldsSerde: FieldsRecordSerde) {
  function serializer(
    serializedData: BitArray,
    fieldsSerializers: RecordSerializer,
    data: Record<string, any>
  ) {
    for (const fieldIndex in Object.keys(fieldsSerializers)) {
      const field = Object.keys(fieldsSerializers)[fieldIndex];
      fieldsSerializers[field](serializedData, Reflect.get(data, field));
    }
  }
  function deserializer(
    fieldsDeserializers: RecordDeserializer,
    serializedData: BitArray
  ): Record<string, any> {
    let data: Record<string, any> = {};
    for (const fieldIndex in Object.keys(fieldsDeserializers)) {
      let field = Object.keys(fieldsDeserializers)[fieldIndex];
      let fieldData =
        fieldsDeserializers[field](serializedData);
      Reflect.set(data, field, fieldData);
    }
    return data;
  }
  return {
    serializer: function(serializedData: BitArray, data) {
      return serializer(serializedData, fieldsSerde.serializer, data);
    },
    deserializer: function(serializedData: BitArray) {
      return deserializer(fieldsSerde.deserializer, serializedData);
    },
  };
}

const ARRAY_LENGTH_DEFAULT_BIT_COUNT: number = 14;
function serdeArray(itemSerde: Serde, bitCount = ARRAY_LENGTH_DEFAULT_BIT_COUNT): Serde {
  const ARRAY_LENGTH_SERDE = serdeUnsignedNum(bitCount);
  function serializer(itemSerializer: Serializer, serializedData: BitArray, arr: any[]) {
    ARRAY_LENGTH_SERDE.serializer(serializedData, arr.length);
    for (const index in arr) {
      itemSerializer(serializedData, arr[index]);
    }
  }
  function deserializer(
    itemDeserializer: Deserializer,
    serializedData: BitArray,
  ): any[] {
    const arrayLength = ARRAY_LENGTH_SERDE.deserializer(serializedData);

    let arr: any[] = [];
    for (let i = 0; i < arrayLength; i++) {
      arr.push(itemDeserializer(serializedData));
    }
    return arr;
  }
  return {
    serializer: function(serializedData: BitArray, arr: any[]) {
      return serializer(itemSerde.serializer, serializedData, arr);
    },
    deserializer: function(serializedData: BitArray) {
      return deserializer(itemSerde.deserializer, serializedData);
    },
  };
}

function serdeMixedArrayRecord(
  arrayItemSerde: Serde,
  recordFieldSerde: FieldsRecordSerde,
  areRecordFieldsOptional = false
): Serde {
  const MIXED_DATA_POSSIBLE_TYPES = areRecordFieldsOptional ? ["Array", "OptionalFieldsRecord"] : ["Array", "Record"];
  function serializer(
    serializedData: BitArray,
    data
  ) {
    if (data instanceof Array) {
      serdeEnumedString(MIXED_DATA_POSSIBLE_TYPES).serializer(serializedData, "Array");
      serdeArray(arrayItemSerde).serializer(serializedData, data);
      return;
    } else if (data.constructor === Object) {
      if (areRecordFieldsOptional) {
        serdeEnumedString(MIXED_DATA_POSSIBLE_TYPES).serializer(serializedData, "OptionalFieldsRecord");
        serdeOptionalFieldsRecord(recordFieldSerde).serializer(serializedData, data);
        return;
      } else {
        serdeEnumedString(MIXED_DATA_POSSIBLE_TYPES).serializer(serializedData, "Record");
        serdeRecord(recordFieldSerde).serializer(serializedData, data);
        return;
      }
    }
    throw new Error(
      "while attempting to serialize " + data + ": data is not Record or Array"
    );
  }
  function deserializer(
    serializedData: BitArray
  ) {
    let dataType = serdeEnumedString(MIXED_DATA_POSSIBLE_TYPES).deserializer(serializedData);
    if (dataType == "Array") {
      return serdeArray(arrayItemSerde).deserializer(serializedData);
    } else if (dataType == "Record") {
      return serdeRecord(recordFieldSerde).deserializer(serializedData);
    } else {
      return serdeOptionalFieldsRecord(recordFieldSerde).deserializer(serializedData);
    }
  }
  return {
    serializer,
    deserializer,
  };
}

function serdeEnumedString(possibleValues: string[]) :Serde {
  function bitsNeeded(possibleValuesCount: number): number {
    return Math.ceil(Math.log2(possibleValuesCount));
  }
  function serializer(possibleValues: string[], serializedData: BitArray, data: string) {
    const neededBits = bitsNeeded(possibleValues.length);
    for (let i = 0; i < possibleValues.length; i++) {
      if (data == possibleValues[i]) {
        serdeUnsignedNum(neededBits).serializer(serializedData, i);
        return;
      }
    }
    throw new Error(
      "value " + data + " is not included in possible values: " + possibleValues
    );
  }
  function deserializer(
    possibleValues: string[],
    serializedData: BitArray,
  ): string {
    const neededBits = bitsNeeded(possibleValues.length);
    const valueIdentifier = serdeUnsignedNum(neededBits).deserializer(serializedData);
    if (valueIdentifier < possibleValues.length) {
      return possibleValues[valueIdentifier];
    }
    throw new Error(
      "valueIdentifier " +
      valueIdentifier +
      " does not exist in possible values: " +
      possibleValues
    );
  }
  return {
    serializer: function(serializedData, data) {
      return serializer(possibleValues, serializedData, data);
    },
    deserializer: function(serializedData) {
      return deserializer(possibleValues, serializedData);
    },
  };
}

function serdeStringifiedArray(itemSerde: Serde) :Serde {
  function serializer(itemSerde: Serde, serializedData: BitArray, arr) {
    if (arr == undefined) {
      console.log("TRYING TO PARSE undefined");
    }
    serdeArray(itemSerde).serializer(serializedData, JSON.parse(arr));
  }
  function deserializer(itemSerde: Serde, serializedData: BitArray) {
    let deserializedData =
      serdeArray(itemSerde).deserializer(serializedData);
    return JSON.stringify(deserializedData);
  }

  return {
    serializer: function(serializedData: BitArray, arr) {
      return serializer(itemSerde, serializedData, arr);
    },
    deserializer: function(serializedArr) {
      return deserializer(itemSerde, serializedArr);
    },
  };
}

function serdeBool() :Serde {
  function serializer(serializedData: BitArray, bool: boolean) {
    serializedData.insertBool(bool);
  }
  function deserializer(serializedData: BitArray) {
    return serializedData.consumeBool()
  }
  return {
    serializer,
    deserializer,
  };
}

function serdeRecordFieldsBuilder(fieldNamesSerdes: [string, Serde][]): FieldsRecordSerde {
  let serdeRecord = {serializer:{},deserializer:{}};
  fieldNamesSerdes.forEach(([fieldName, fieldSerde]) => {
    serdeRecord["serializer"][fieldName] = fieldSerde.serializer;
    serdeRecord["deserializer"][fieldName] = fieldSerde.deserializer;
  });
  return serdeRecord;
}

export function serialize(serializer: Serializer, data: any): Uint8Array {
  let serializedData = new BitArray();
  serializer(serializedData, data);
  return serializedData.consume();
}

export function deserialize(deserializer: Deserializer, serializedDataUint8: Uint8Array): any {
  let serializedData = new BitArray(serializedDataUint8);
  return deserializer(serializedData);
}

const TEAM_NUMBER_BIT_COUNT = 2 * 8;

const TRAP_POSSIBLE_VALUES = ["Didn't Score", "Scored", "Miss"];

const CLIMB_POSSIBLE_VALUES = [
  "Off Stage",
  "Park",
  "Climbed Alone",
  "Harmony",
  "Harmony Three Robots",
];

const GAME_SIDE_POSSIBLE_VALUES = ["Blue", "Red"];

const QUAL_BIT_COUNT = 2 * 8;

const SPEAKER_SCORE_MISS_BIT_COUNT = 2 * 8;

const CRESCENDO_POINTS_CORDS_BIT_COUNT = 2 * 8;
const CRESCENDO_POINTS_DATA_POSSIBLE_VALUES = ["Speaker", "Pass"];
const CRESSENDO_POINTS_INNER_SERDE_RECORD_FIELDS = serdeRecordFieldsBuilder([
  ["x",serdeUnsignedNum(CRESCENDO_POINTS_CORDS_BIT_COUNT)],
  ["y",serdeUnsignedNum(CRESCENDO_POINTS_CORDS_BIT_COUNT)],
  ["data",serdeEnumedString(CRESCENDO_POINTS_DATA_POSSIBLE_VALUES)],
  ["successfulness",serdeBool()],
]);
const CRESCENDO_POINTS_ARRAY_SERDE: Serde = serdeStringifiedArray(
  serdeMixedArrayRecord(
    serdeOptionalFieldsRecord(
      CRESSENDO_POINTS_INNER_SERDE_RECORD_FIELDS
    ),
    CRESSENDO_POINTS_INNER_SERDE_RECORD_FIELDS,
    true
  )
);

const CRESCENDO_AMP_MISS_BIT_COUNT = 2 * 8;

const CRESCENDO_AMP_SCORE_BIT_COUNT = 2 * 8;

const AUTOMAP_STARTING_SIDE_POSSIBLE_VALUES = ["blue", "red"];

const AUTOMAP_NOTES_CORDS_BIT_COUNT = CRESCENDO_POINTS_CORDS_BIT_COUNT;
const AUTOMAP_NOTE_POSSIBLE_COLORS = ["orange", "green", "red"];
const AUTOMAP_NOTES_SERDE = serdeStringifiedArray(
  serdeRecord(
    serdeRecordFieldsBuilder([
      ["y",serdeUnsignedNum(AUTOMAP_NOTES_CORDS_BIT_COUNT)],
      ["x",serdeUnsignedNum(AUTOMAP_NOTES_CORDS_BIT_COUNT)],
      ["color",serdeEnumedString(AUTOMAP_NOTE_POSSIBLE_COLORS)],
    ])
  )
);

const STARTING_POSITION_POSSIBLE_VALUES = [
  "Amp Side",
  "Middle",
  "Source Side",
  "No Show",
];

export const qrSerde: FieldsRecordSerde = serdeRecordFieldsBuilder([
   ["Team Number", serdeStringifiedNum(TEAM_NUMBER_BIT_COUNT)],
   ["Trap", serdeEnumedString(TRAP_POSSIBLE_VALUES)],
   ["Climb", serdeEnumedString(CLIMB_POSSIBLE_VALUES)],
   ["Game Side", serdeEnumedString(GAME_SIDE_POSSIBLE_VALUES)],
   ["Qual", serdeStringifiedNum(QUAL_BIT_COUNT)],
   ["Speaker/Auto/Score", serdeStringifiedNum(SPEAKER_SCORE_MISS_BIT_COUNT)],
   ["Scouter Name", serdeString()],
   ["Comment", serdeString()],
   ["CRESCENDO/Points", CRESCENDO_POINTS_ARRAY_SERDE],
   ["CRESCENDO/Amp/Score", serdeStringifiedNum(CRESCENDO_AMP_SCORE_BIT_COUNT)],
   ["AutoMap/Side", serdeEnumedString(AUTOMAP_STARTING_SIDE_POSSIBLE_VALUES)],
   ["Automap/Notes", AUTOMAP_NOTES_SERDE],
   ["CRESCENDO/Amp/Miss", serdeStringifiedNum(CRESCENDO_AMP_MISS_BIT_COUNT)],
   ["Starting Position", serdeEnumedString(STARTING_POSITION_POSSIBLE_VALUES)],
   ["Speaker/Auto/Miss", serdeStringifiedNum(SPEAKER_SCORE_MISS_BIT_COUNT)],
]);
