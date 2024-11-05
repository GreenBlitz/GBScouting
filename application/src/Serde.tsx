// TODO renmare serialied(string,num) to serializedData (since other thing may be present)

function rangeArr(rangeStart: number, rangeEnd: number): number[] {
  return Array(rangeEnd - rangeStart)
    .fill(0)
    .map((_, i) => i + rangeStart);
}

class BitArray {
  boolArr: Array<boolean>;
  bitCount: number;

  constructor(arr?: Uint8Array) {
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
function serdeNum(bitCount: number) {
  const bits = bitCount;
  function serializer(serialiedData: BitArray, num: number) {
    let arr = new BitArray();

    for (let i = 0; i < bits; i++) {
      arr.insertBool(num % 2 === 1);
      num = Math.floor(num / 2);
    }
    serialiedData.insert(arr);
  }
  function deserializer(serializedNum: BitArray): number {
    let num = 0;

    for (let i = 0; i < bits; i++) {
      num += Math.pow(2, i) * (serializedNum.consumeBool() ? 1 : 0);
    }
    return num;
  }
  return {
    serializer,
    deserializer,
  };
}

function serdeStringifiedNum(bitCount: number) {
  const bits = bitCount;
  function serializer(seriailzedData: BitArray, num: string) {
    return serdeNum(bits).serializer(seriailzedData, Number(num));
  }
  function deserializer(seriailzedData: BitArray): string {
    return serdeNum(bits).deserializer(seriailzedData).toString();
  }
  return {
    serializer,
    deserializer,
  };
}

function serdeString() {
  const STRING_LENGTH_BIT_COUNT: number = 4 * 8;
  function serializer(serializedData: BitArray, string: string) {
    const encodedString: Uint8Array = new TextEncoder().encode(string);

    serdeNum(STRING_LENGTH_BIT_COUNT).serializer(
      serializedData,
      encodedString.length
    );
    serializedData.insert(encodedString, encodedString.length * 8);
  }
  function deserializer(serializedString: BitArray): string {
    let encodedStringLength = serdeNum(STRING_LENGTH_BIT_COUNT).deserializer(
      serializedString
    );
    let encodedString = serializedString.consumeBits(encodedStringLength);
    return new TextDecoder().decode(encodedString);
  }
  return {
    serializer: serializer,
    deserializer: deserializer,
  };
}

type Serializer = (seriailzedData: BitArray, data: any) => void;
// return field name, and its appropriate Serializer
type RecordSerializer = Record<string, Serializer>;

// returns the deserializedData
type Deserializer = (serializedData: BitArray) => any;
// return field name, and its appropriate Deserializer
type RecordDeserializer = Record<string, Deserializer>;

type RecordFieldsSerde = {
  serializer: RecordSerializer;
  deserializer: RecordDeserializer;
};
type ArrayItemsSerde = { serializer: Serializer; deserializer: Deserializer };

function serdeOptionalFieldsRecord(fieldsSerde: RecordFieldsSerde) {
  function fieldsExistenceByteCount(
    fields: RecordSerializer | RecordDeserializer
  ): number {
    return Math.ceil(Object.keys(fields).length / 8);
  }
  function serializer(
    serializedData: BitArray,
    fieldsSerializers: RecordSerializer,
    data: Record<string, any>
  ) {
    let fieldsExistenceValues = 0;
    for (const fieldIndex in Object.keys(fieldsSerializers)) {
      let field = Object.keys(fieldsSerializers)[fieldIndex];
      fieldsExistenceValues = fieldsExistenceValues << 1;
      try {
        let fieldValue = Reflect.get(data, field);
        if (fieldValue == undefined) {
          continue;
        }
        let serializedField = fieldsSerializers[field](fieldValue);
        serializedData = combineByteArrays(serializedData, serializedField);
        fieldsExistenceValues = fieldsExistenceValues |= 1;
      } catch (error) {}
    }
    return combineByteArrays(
      serdeNum(fieldsExistenceByteCount(fieldsSerializers)).serializer(
        fieldsExistenceValues
      ),
      serializedData
    );
  }
  function deserializer(
    fieldsDeserializers: RecordDeserializer,
    serializedData
  ): [Record<string, any>, number] {
    let data: Record<string, string> = {};
    let totalConsumedBytes: number = 0;
    let _consumedData;

    let [fieldsExistence, _fieldsExistenceByteCount]: [number, number] =
      serdeNum(fieldsExistenceByteCount(fieldsDeserializers)).deserializer(
        serializedData
      );
    [_consumedData, serializedData] = splitByteArrayAt(
      serializedData,
      fieldsExistenceByteCount(fieldsDeserializers)
    );
    totalConsumedBytes += fieldsExistenceByteCount(fieldsDeserializers);

    const deserializersKeys = Object.keys(fieldsDeserializers);
    for (let i = 0; i < deserializersKeys.length; i++) {
      if ((fieldsExistence & (1 << (deserializersKeys.length - 1 - i))) === 0) {
        continue;
      } else {
      }

      const field = deserializersKeys[i];
      let [fieldData, consumedBytes] =
        fieldsDeserializers[field](serializedData);
      Reflect.set(data, field, fieldData);

      [_consumedData, serializedData] = splitByteArrayAt(
        serializedData,
        consumedBytes
      );
      totalConsumedBytes += consumedBytes;
    }
    let returnValue: [Record<string, any>, number] = [data, totalConsumedBytes];
    return returnValue;
  }
  return {
    serializer: function (data) {
      return serializer(fieldsSerde.serializer, data);
    },
    deserializer: function (serializedData) {
      return deserializer(fieldsSerde.deserializer, serializedData);
    },
  };
}

export function serdeRecord(fieldsSerde: RecordFieldsSerde) {
  function serializer(
    fieldsSerializers: RecordSerializer,
    data: Record<string, any>
  ): Uint8Array {
    let serializedData: Uint8Array = new Uint8Array(0);
    for (const fieldIndex in Object.keys(fieldsSerializers)) {
      const field = Object.keys(fieldsSerializers)[fieldIndex];
      let serializedField = fieldsSerializers[field](Reflect.get(data, field));
      serializedData = combineByteArrays(serializedData, serializedField);
    }
    return serializedData;
  }
  function deserializer(
    fieldsDeserializers: RecordDeserializer,
    serializedData
  ): [Record<string, any>, number] {
    let data: Record<string, string> = {};
    let totalConsumedBytes: number = 0;
    let _consumedData;
    for (const fieldIndex in Object.keys(fieldsDeserializers)) {
      let field = Object.keys(fieldsDeserializers)[fieldIndex];
      let [fieldData, consumedBytes] =
        fieldsDeserializers[field](serializedData);
      Reflect.set(data, field, fieldData);

      [_consumedData, serializedData] = splitByteArrayAt(
        serializedData,
        consumedBytes
      );
      totalConsumedBytes += consumedBytes;
    }
    let returnValue: [Record<string, any>, number] = [data, totalConsumedBytes];
    return returnValue;
  }
  return {
    serializer: function (data) {
      return serializer(fieldsSerde.serializer, data);
    },
    deserializer: function (serializedData) {
      return deserializer(fieldsSerde.deserializer, serializedData);
    },
  };
}

const ARRAY_LENGTH_BYTE_COUNT: number = 2;
function serdeArray(itemSerde: ArrayItemsSerde) {
  function serializer(itemSerializer: Serializer, arr: any[]) {
    let serializedData: Uint8Array = serdeNum(
      ARRAY_LENGTH_BYTE_COUNT
    ).serializer(arr.length);
    for (const index in arr) {
      serializedData = combineByteArrays(
        serializedData,
        itemSerializer(arr[index])
      );
    }
    return serializedData;
  }
  function deserializer(
    itemDeserializer: Deserializer,
    serializedArr: Uint8Array
  ) {
    const [arrayLength, array_length_byte_count]: [number, number] = serdeNum(
      ARRAY_LENGTH_BYTE_COUNT
    ).deserializer(serializedArr);
    let _consumedItem;
    [_consumedItem, serializedArr] = splitByteArrayAt(
      serializedArr,
      ARRAY_LENGTH_BYTE_COUNT
    );
    let arr: any[] = [];
    let totalConsumedBytes: number = array_length_byte_count;
    for (let i = 0; i < arrayLength; i++) {
      let [item, consumedBytes]: [any, number] =
        itemDeserializer(serializedArr);
      arr.push(item);

      [_consumedItem, serializedArr] = splitByteArrayAt(
        serializedArr,
        consumedBytes
      );
      totalConsumedBytes += consumedBytes;
    }
    const returnValue: [any[], number] = [arr, totalConsumedBytes];
    return returnValue;
  }
  return {
    serializer: function (arr) {
      return serializer(itemSerde.serializer, arr);
    },
    deserializer: function (serializedArr) {
      return deserializer(itemSerde.deserializer, serializedArr);
    },
  };
}

function serdeMixedArrayRecord(
  arrayItemSerde: ArrayItemsSerde,
  recordFieldSerde: RecordFieldsSerde,
  areRecordFieldsOptional = false
): ArrayItemsSerde {
  const MIXED_DATA_POSSIBLE_TYPES = ["Array", "Record", "OptionalFieldsRecord"];
  function serializer(
    arraySerializer: Serializer,
    recordSerializer: RecordSerializer,
    data
  ) {
    if (data instanceof Array) {
      const typeSignature = serdeEnumedString(
        MIXED_DATA_POSSIBLE_TYPES
      ).serializer("Array");
      return combineByteArrays(
        typeSignature,
        serdeArray(arrayItemSerde).serializer(data)
      );
    } else if (data.constructor === Object) {
      if (areRecordFieldsOptional) {
        const typeSignature = serdeEnumedString(
          MIXED_DATA_POSSIBLE_TYPES
        ).serializer("OptionalFieldsRecord");
        return combineByteArrays(
          typeSignature,
          serdeOptionalFieldsRecord(recordFieldSerde).serializer(data)
        );
      } else {
        const typeSignature = serdeEnumedString(
          MIXED_DATA_POSSIBLE_TYPES
        ).serializer("Record");
        return combineByteArrays(
          typeSignature,
          serdeRecord(recordFieldSerde).serializer(data)
        );
      }
    }
    throw new Error(
      "while attempting to serialize " + data + ": data is not Record or Array"
    );
  }
  function deserializer(
    arraySerializer: Deserializer,
    recordSerializer: RecordDeserializer,
    serializedData
  ) {
    let [dataType, typeSingnatureByteCount] = serdeEnumedString(
      MIXED_DATA_POSSIBLE_TYPES
    ).deserializer(serializedData);
    if (dataType == "Array") {
      let [data, dataByteCount] = serdeArray(arrayItemSerde).deserializer(
        splitByteArrayAt(serializedData, typeSingnatureByteCount)[1]
      );
      let returnValue: [any, number] = [
        data,
        dataByteCount + typeSingnatureByteCount,
      ];
      return returnValue;
    } else if (dataType == "Record") {
      let [data, dataByteCount] = serdeRecord(recordFieldSerde).deserializer(
        splitByteArrayAt(serializedData, typeSingnatureByteCount)[1]
      );
      let returnValue: [any, number] = [
        data,
        dataByteCount + typeSingnatureByteCount,
      ];
      return returnValue;
    } else {
      let [data, dataByteCount] = serdeOptionalFieldsRecord(
        recordFieldSerde
      ).deserializer(
        splitByteArrayAt(serializedData, typeSingnatureByteCount)[1]
      );
      let returnValue: [any, number] = [
        data,
        dataByteCount + typeSingnatureByteCount,
      ];
      return returnValue;
    }
  }
  return {
    serializer: function (data) {
      return serializer(
        arrayItemSerde.serializer,
        recordFieldSerde.serializer,
        data
      );
    },
    deserializer: function (data) {
      return deserializer(
        arrayItemSerde.deserializer,
        recordFieldSerde.deserializer,
        data
      );
    },
  };
}

function serdeEnumedString(possibleValues: string[]) {
  function bytesNeeded(possibleValuesCount: number): number {
    return Math.ceil(Math.log2(possibleValuesCount) / 8);
  }
  function serializer(possibleValues: string[], data: string) {
    const neededBytes = bytesNeeded(possibleValues.length);
    for (let i = 0; i < possibleValues.length; i++) {
      if (data == possibleValues[i]) {
        return serdeNum(neededBytes).serializer(i);
      }
    }
    throw new Error(
      "value " + data + " is not included in possible values: " + possibleValues
    );
  }
  function deserializer(
    possibleValues: string[],
    serializedData: Uint8Array
  ): [string, number] {
    const neededBytes = bytesNeeded(possibleValues.length);
    const valueIdentifier =
      serdeNum(neededBytes).deserializer(serializedData)[0];
    if (valueIdentifier < possibleValues.length) {
      return [possibleValues[valueIdentifier], neededBytes];
    }
    throw new Error(
      "valueIdentifier " +
        valueIdentifier +
        " does not exist in possible values: " +
        possibleValues
    );
  }
  return {
    serializer: function (data) {
      return serializer(possibleValues, data);
    },
    deserializer: function (serializedData) {
      return deserializer(possibleValues, serializedData);
    },
    bytesNeeded: function () {
      return bytesNeeded(possibleValues.length);
    },
  };
}

function serdeStringifiedArray(itemSerde: ArrayItemsSerde) {
  function serializer(itemSerde: ArrayItemsSerde, arr) {
    if (arr == undefined) {
      console.log("TRYING TO PARSE undefined");
    }
    return serdeArray(itemSerde).serializer(JSON.parse(arr));
  }
  function deserializer(itemSerde: ArrayItemsSerde, serializedArr) {
    let [deserializedData, consumedBytes] =
      serdeArray(itemSerde).deserializer(serializedArr);
    let returnValue: [string, number] = [
      JSON.stringify(deserializedData),
      consumedBytes,
    ];
    return returnValue;
  }

  return {
    serializer: function (arr) {
      return serializer(itemSerde, arr);
    },
    deserializer: function (serializedArr) {
      return deserializer(itemSerde, serializedArr);
    },
  };
}

function serdeBool() {
  const BOOL_BYTE_COUNT = 1;
  function serializer(bool: boolean) {
    if (bool) {
      return serdeNum(BOOL_BYTE_COUNT).serializer(1);
    } else {
      return serdeNum(BOOL_BYTE_COUNT).serializer(0);
    }
  }
  function deserializer(data: Uint8Array) {
    if (serdeNum(BOOL_BYTE_COUNT).deserializer(data)[0] === 0) {
      const returnValue: [boolean, number] = [false, BOOL_BYTE_COUNT];
      return returnValue;
    } else {
      const returnValue: [boolean, number] = [true, BOOL_BYTE_COUNT];
      return returnValue;
    }
  }
  return {
    serializer: serializer,
    deserializer: deserializer,
  };
}

const TEAM_NUMBER_BYTE_COUNT = 2;

const TRAP_POSSIBLE_VALUES = ["Didn't Score", "Scored", "Miss"];

const CLIMB_POSSIBLE_VALUES = [
  "Off Stage",
  "Park",
  "Climbed Alone",
  "Harmony",
  "Harmony Three Robots",
];

const GAME_SIDE_POSSIBLE_VALUES = ["Blue", "Red"];

const QUAL_BYTE_COUNT = 2;

const SPEAKER_SCORE_MISS_BYTE_COUNT = 2;

const CRESCENDO_POINTS_CORDS_BYTE_COUNT = 2;
const CRESCENDO_POINTS_DATA_POSSIBLE_VALUES = ["Speaker", "Pass"];
const CRESCENDO_POINTS_ARRAY_SERDE: ArrayItemsSerde = serdeStringifiedArray(
  serdeMixedArrayRecord(
    serdeOptionalFieldsRecord({
      serializer: {
        x: serdeNum(CRESCENDO_POINTS_CORDS_BYTE_COUNT).serializer,
        y: serdeNum(CRESCENDO_POINTS_CORDS_BYTE_COUNT).serializer,
        data: serdeEnumedString(CRESCENDO_POINTS_DATA_POSSIBLE_VALUES)
          .serializer,
        successfulness: serdeBool().serializer,
      },
      deserializer: {
        x: serdeNum(CRESCENDO_POINTS_CORDS_BYTE_COUNT).deserializer,
        y: serdeNum(CRESCENDO_POINTS_CORDS_BYTE_COUNT).deserializer,
        data: serdeEnumedString(CRESCENDO_POINTS_DATA_POSSIBLE_VALUES)
          .deserializer,
        successfulness: serdeBool().deserializer,
      },
    }),
    {
      serializer: {
        x: serdeNum(CRESCENDO_POINTS_CORDS_BYTE_COUNT).serializer,
        y: serdeNum(CRESCENDO_POINTS_CORDS_BYTE_COUNT).serializer,
        data: serdeEnumedString(CRESCENDO_POINTS_DATA_POSSIBLE_VALUES)
          .serializer,
        successfulness: serdeBool().serializer,
      },
      deserializer: {
        x: serdeNum(CRESCENDO_POINTS_CORDS_BYTE_COUNT).deserializer,
        y: serdeNum(CRESCENDO_POINTS_CORDS_BYTE_COUNT).deserializer,
        data: serdeEnumedString(CRESCENDO_POINTS_DATA_POSSIBLE_VALUES)
          .deserializer,
        successfulness: serdeBool().deserializer,
      },
    },
    true
  )
);

const CRESCENDO_AMP_MISS_BYTE_COUNT = 2;

const CRESCENDO_AMP_SCORE_BYTE_COUNT = 2;

const AUTOMAP_STARTING_SIDE_POSSIBLE_VALUES = ["blue", "red"];

const AUTOMAP_NOTES_CORDS_BYTE_COUNT = CRESCENDO_POINTS_CORDS_BYTE_COUNT;
const AUTOMAP_NOTE_POSSIBLE_COLORS = ["orange", "green", "red"]; // TODO check if red is correct!
const AUTOMAP_NOTES_SERDE = serdeStringifiedArray(
  serdeRecord({
    serializer: {
      x: serdeNum(AUTOMAP_NOTES_CORDS_BYTE_COUNT).serializer,
      y: serdeNum(AUTOMAP_NOTES_CORDS_BYTE_COUNT).serializer,
      color: serdeEnumedString(AUTOMAP_NOTE_POSSIBLE_COLORS).serializer,
    },
    deserializer: {
      x: serdeNum(AUTOMAP_NOTES_CORDS_BYTE_COUNT).deserializer,
      y: serdeNum(AUTOMAP_NOTES_CORDS_BYTE_COUNT).deserializer,
      color: serdeEnumedString(AUTOMAP_NOTE_POSSIBLE_COLORS).deserializer,
    },
  })
);

const STARTING_POSITION_POSSIBLE_VALUES = [
  "Amp Side",
  "Middle",
  "Source Side",
  "No Show",
];

export const qrSerde: RecordFieldsSerde = {
  serializer: {
    "Team Number": serdeStringifiedNum(TEAM_NUMBER_BYTE_COUNT).serializer,
    Trap: serdeEnumedString(TRAP_POSSIBLE_VALUES).serializer,
    Climb: serdeEnumedString(CLIMB_POSSIBLE_VALUES).serializer,
    "Game Side": serdeEnumedString(GAME_SIDE_POSSIBLE_VALUES).serializer,
    Qual: serdeStringifiedNum(QUAL_BYTE_COUNT).serializer,
    "Speaker/Auto/Score": serdeStringifiedNum(SPEAKER_SCORE_MISS_BYTE_COUNT)
      .serializer,
    "Scouter Name": serdeString().serializer,
    Comment: serdeString().serializer,
    "CRESCENDO/Points": CRESCENDO_POINTS_ARRAY_SERDE.serializer,
    "CRESCENDO/Amp/Score": serdeStringifiedNum(CRESCENDO_AMP_SCORE_BYTE_COUNT)
      .serializer,
    "AutoMap/Side": serdeEnumedString(AUTOMAP_STARTING_SIDE_POSSIBLE_VALUES)
      .serializer,
    "Automap/Notes": AUTOMAP_NOTES_SERDE.serializer,
    "CRESCENDO/Amp/Miss": serdeStringifiedNum(CRESCENDO_AMP_MISS_BYTE_COUNT)
      .serializer,
    "Starting Position": serdeEnumedString(STARTING_POSITION_POSSIBLE_VALUES)
      .serializer,
    "Speaker/Auto/Miss": serdeStringifiedNum(SPEAKER_SCORE_MISS_BYTE_COUNT)
      .serializer,
  },
  deserializer: {
    "Team Number": serdeStringifiedNum(TEAM_NUMBER_BYTE_COUNT).deserializer,
    Trap: serdeEnumedString(TRAP_POSSIBLE_VALUES).deserializer,
    Climb: serdeEnumedString(CLIMB_POSSIBLE_VALUES).deserializer,
    "Game Side": serdeEnumedString(GAME_SIDE_POSSIBLE_VALUES).deserializer,
    Qual: serdeStringifiedNum(QUAL_BYTE_COUNT).deserializer,
    "Speaker/Auto/Score": serdeStringifiedNum(SPEAKER_SCORE_MISS_BYTE_COUNT)
      .deserializer,
    "Scouter Name": serdeString().deserializer,
    Comment: serdeString().deserializer,
    "CRESCENDO/Points": CRESCENDO_POINTS_ARRAY_SERDE.deserializer,
    "CRESCENDO/Amp/Score": serdeStringifiedNum(CRESCENDO_AMP_SCORE_BYTE_COUNT)
      .deserializer,
    "AutoMap/Side": serdeEnumedString(AUTOMAP_STARTING_SIDE_POSSIBLE_VALUES)
      .deserializer,
    "Automap/Notes": AUTOMAP_NOTES_SERDE.deserializer,
    "CRESCENDO/Amp/Miss": serdeStringifiedNum(CRESCENDO_AMP_MISS_BYTE_COUNT)
      .deserializer,
    "Starting Position": serdeEnumedString(STARTING_POSITION_POSSIBLE_VALUES)
      .deserializer,
    "Speaker/Auto/Miss": serdeStringifiedNum(SPEAKER_SCORE_MISS_BYTE_COUNT)
      .deserializer,
  },
};
