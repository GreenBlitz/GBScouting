import ScouterInput from "../scouter/ScouterInput";
import ScouterInputs from "../scouter/ScouterInputs";

type InputType = typeof ScouterInputs;

type InputsMapped = {
  // ScouterName: string, Qual: number ...
  [K in keyof InputType]: InputType[K] extends ScouterInput<infer U, any, any>
    ? U
    : never;
};

type ExcludeByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

export type Match = ExcludeByType<InputsMapped, never>;

interface MapFields {
  speakerScore: number;
  speakerMiss: number;

  successfulPass: number;
  failPass: number;
}

export type FullMatch = Match & MapFields;

const mapFields: MapFields = {
  speakerScore: 0,
  speakerMiss: 0,
  successfulPass: 0,
  failPass: 0,
};

export const matchFieldNames = Object.keys(ScouterInputs)
  .concat(Object.keys(mapFields))
  .reduce((acccumulator, key) => {
    acccumulator[key] = key;
    return acccumulator;
  }, {} as Record<keyof FullMatch, keyof FullMatch>);
