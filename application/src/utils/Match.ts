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

export const matchFieldNames = Object.keys(ScouterInputs).reduce(
  (acccumulator, key) => {
    acccumulator[key] = key;
    return acccumulator;
  },
  {} as Record<keyof Match, keyof Match>
);

export const mergeMatches: (matches: Match[]) => Match = (matches: Match[]) => {
  const avg = (numbers: number[]) =>
    numbers.reduce((accumulator, value) => accumulator + value, 0) /
    numbers.length;

  const avgFields = (fields: string[]) =>
    avg(
      matches
        .map((match) =>
          fields.reduce(
            (accumulator, innerField) => accumulator[innerField],
            match
          )
        )
        .map((match) => match as unknown as number)
    );

  const mergeUndefinedNumbers = (
    numbers: (number | "undefined" | undefined)[],
    
  ) => {
    const filteredOnes = numbers.filter((number) => typeof number === "number");
    if (filteredOnes.length === 0) {
      return undefined;
    }
    return avg(filteredOnes);
  };

  const mergeUndefinedFields = (fields: string[]) => 
    mergeUndefinedNumbers(
      matches
        .map((match) =>
          fields.reduce(
            (accumulator, innerField) => accumulator[innerField],
            match
          )
        )
        .map((match) => match as unknown as (number | undefined | "undefined"))
    );

  const mergeBooleans = (booleans: boolean[]) =>
    booleans.reduce((accumulator, value) => accumulator || value, false);
  const mergeBooleanFields = (fields: string[]) =>
    mergeBooleans(
      matches
        .map((match) =>
          fields.reduce(
            (accumulator, innerField) => accumulator[innerField],
            match
          )
        )
        .map((match) => match as unknown as boolean)
    );

  return {
    scouterName: matches[0].scouterName,
    qual: matches[0].qual,
    teamNumber: matches[0].teamNumber,
    noShow: matches[0].noShow,
    defense: mergeUndefinedFields(["defense"]),
    defensiveEvasion: mergeUndefinedFields(["defensiveEvasion"]),
    climb: matches[0].climb,
    comment: matches.reduce(
      (accumulator, match) => accumulator + ", " + match.comment,
      ""
    ),
    teleReefPick: {
      algea: {
        netScore: avgFields(["teleReefPick", "algea", "netScore"]),
        netMiss: avgFields(["teleReefPick", "algea", "netMiss"]),
        processor: avgFields(["teleReefPick", "algea", "processor"]),
      },
      levels: {
        L1: {
          score: avgFields(["teleReefPick", "levels", "L1", "score"]),
          miss: avgFields(["teleReefPick", "levels", "L1", "miss"]),
        },
        L2: {
          score: avgFields(["teleReefPick", "levels", "L2", "score"]),
          miss: avgFields(["teleReefPick", "levels", "L2", "miss"]),
        },
        L3: {
          score: avgFields(["teleReefPick", "levels", "L3", "score"]),
          miss: avgFields(["teleReefPick", "levels", "L3", "miss"]),
        },
        L4: {
          score: avgFields(["teleReefPick", "levels", "L4", "score"]),
          miss: avgFields(["teleReefPick", "levels", "L4", "miss"]),
        },
      },
    },
    autoReefPick: {
      algea: {
        netScore: avgFields(["autoReefPick", "algea", "netScore"]),
        netMiss: avgFields(["autoReefPick", "algea", "netMiss"]),
        processor: avgFields(["autoReefPick", "algea", "processor"]),
      },
      levels: {
        L1: {
          score: avgFields(["autoReefPick", "levels", "L1", "score"]),
          miss: avgFields(["autoReefPick", "levels", "L1", "miss"]),
        },
        L2: {
          score: avgFields(["autoReefPick", "levels", "L2", "score"]),
          miss: avgFields(["autoReefPick", "levels", "L2", "miss"]),
        },
        L3: {
          score: avgFields(["autoReefPick", "levels", "L3", "score"]),
          miss: avgFields(["autoReefPick", "levels", "L3", "miss"]),
        },
        L4: {
          score: avgFields(["autoReefPick", "levels", "L4", "score"]),
          miss: avgFields(["autoReefPick", "levels", "L4", "miss"]),
        },
      },
    },
    endgameCollection: {
      algeaReefCollected: mergeBooleanFields(["endgameCollection", "algeaReefCollected"]),
      algeaReefDropped: mergeBooleanFields(["endgameCollection", "algeaReefDropped"]),
      algeaGroundCollected: mergeBooleanFields(["endgameCollection", "algeaGroundCollected"]),
      coralGroundCollected: mergeBooleanFields(["endgameCollection", "coralGround"]),
      coralFeederCollected: mergeBooleanFields(["endgameCollection", "coralFeederCollected"]),
    },
  };
};

export const randomMatch = (teamNumber: number, qual: number) => {
  return {} as Match;
};
