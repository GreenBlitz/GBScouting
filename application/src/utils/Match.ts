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

export const mergeMatches: (match1: Match, match2: Match) => Match = (
  match1: Match,
  match2: Match
) => {
  const avg = (n1: number, n2: number) => (n1 + n2) / 2;

  const mergeUndefinedNumbers = (
    n1: number | undefined,
    n2: number | undefined
  ) => {
    if (n1 && n2) {
      return avg(n1, n2);
    }
    if (n1) {
      return n1;
    }
    return n2;
  };

  return {
    scouterName: match1.scouterName + " & " + match2.scouterName,
    qual: match1.qual,
    teamNumber: match1.teamNumber,
    noShow: match1.noShow,
    defense: mergeUndefinedNumbers(match1.defense, match2.defense),
    defensiveEvasion: mergeUndefinedNumbers(
      match1.defensiveEvasion,
      match2.defensiveEvasion
    ),
    climb: match1.climb,
    comment: match1.comment + ",   " + match2.comment,
    teleReefPick: {
      algea: {
        netScore: avg(
          match1.teleReefPick.algea.netScore,
          match2.teleReefPick.algea.netScore
        ),
        netMiss: avg(
          match1.teleReefPick.algea.netMiss,
          match2.teleReefPick.algea.netMiss
        ),
        processor: avg(
          match1.teleReefPick.algea.processor,
          match2.teleReefPick.algea.processor
        ),
      },
      levels: {
        L1: {
          score: avg(
            match1.teleReefPick.levels.L1.score,
            match1.teleReefPick.levels.L1.score
          ),
          miss: avg(
            match1.teleReefPick.levels.L1.miss,
            match1.teleReefPick.levels.L1.miss
          ),
        },
        L2: {
          score: avg(
            match1.teleReefPick.levels.L2.score,
            match1.teleReefPick.levels.L2.score
          ),
          miss: avg(
            match1.teleReefPick.levels.L2.miss,
            match1.teleReefPick.levels.L2.miss
          ),
        },
        L3: {
          score: avg(
            match1.teleReefPick.levels.L3.score,
            match1.teleReefPick.levels.L3.score
          ),
          miss: avg(
            match1.teleReefPick.levels.L3.miss,
            match1.teleReefPick.levels.L3.miss
          ),
        },
        L4: {
          score: avg(
            match1.teleReefPick.levels.L4.score,
            match1.teleReefPick.levels.L4.score
          ),
          miss: avg(
            match1.teleReefPick.levels.L4.miss,
            match1.teleReefPick.levels.L4.miss
          ),
        },
      },
    },
    autoReefPick: {
      algea: {
        netScore: avg(
          match1.autoReefPick.algea.netScore,
          match2.autoReefPick.algea.netScore
        ),
        netMiss: avg(
          match1.autoReefPick.algea.netMiss,
          match2.autoReefPick.algea.netMiss
        ),
        processor: avg(
          match1.autoReefPick.algea.processor,
          match2.autoReefPick.algea.processor
        ),
      },
      levels: {
        L1: {
          score: avg(
            match1.autoReefPick.levels.L1.score,
            match1.autoReefPick.levels.L1.score
          ),
          miss: avg(
            match1.autoReefPick.levels.L1.miss,
            match1.autoReefPick.levels.L1.miss
          ),
        },
        L2: {
          score: avg(
            match1.autoReefPick.levels.L2.score,
            match1.autoReefPick.levels.L2.score
          ),
          miss: avg(
            match1.autoReefPick.levels.L2.miss,
            match1.autoReefPick.levels.L2.miss
          ),
        },
        L3: {
          score: avg(
            match1.autoReefPick.levels.L3.score,
            match1.autoReefPick.levels.L3.score
          ),
          miss: avg(
            match1.autoReefPick.levels.L3.miss,
            match1.autoReefPick.levels.L3.miss
          ),
        },
        L4: {
          score: avg(
            match1.autoReefPick.levels.L4.score,
            match1.autoReefPick.levels.L4.score
          ),
          miss: avg(
            match1.autoReefPick.levels.L4.miss,
            match1.autoReefPick.levels.L4.miss
          ),
        },
      },
    },
    endgameCollection: {
      algeaReefCollected:
        match1.endgameCollection.algeaReefCollected ||
        match2.endgameCollection.algeaReefCollected,
      algeaReefDropped:
        match1.endgameCollection.algeaReefDropped ||
        match2.endgameCollection.algeaReefDropped,
      algeaGroundCollected:
        match1.endgameCollection.algeaGroundCollected ||
        match2.endgameCollection.algeaGroundCollected,
      coralGroundCollected:
        match1.endgameCollection.coralGroundCollected ||
        match2.endgameCollection.coralGroundCollected,
      coralFeederCollected:
        match1.endgameCollection.coralFeederCollected ||
        match2.endgameCollection.coralFeederCollected,
    },
  };
};

export const randomMatch = (teamNumber: number, qual: number) => {
  return {} as Match;
};
