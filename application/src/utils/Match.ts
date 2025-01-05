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


export const matchFieldNames = Object.keys(ScouterInputs)
  .reduce((acccumulator, key) => {
    acccumulator[key] = key;
    return acccumulator;
  }, {} as Record<keyof Match, keyof Match>);
