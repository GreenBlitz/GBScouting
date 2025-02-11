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

export const randomMatch = (teamNumber: number, qual: number) => {
  const climbNumber = Math.floor(Math.random() * 4 + 1);
  const match: Match = {
    scouterName: "Random",
    qual,
    teamNumber,
    gameSide: "Blue",
    startingPosition: "Far Side",
    noShow: false,
    defense: Math.floor(Math.random() * 5 + 1),
    defensiveEvasion: Math.floor(Math.random() * 5 + 1),
    climb:
      climbNumber === 4
        ? "Off Barge"
        : climbNumber === 3
        ? "Park"
        : climbNumber === 2
        ? "Shallow Cage"
        : "Deep Cage",
    comment: "Random",
    teleopReef: {
      side: "left",
      proximity: "far",
    },
    teleopReefLevels: {
      algea: {
        collected: Math.random() > 0.5,
        dropped: Math.random() > 0.5,
      },
      L1: {
        score: Math.floor(Math.random() * 3 + 1),
        miss: Math.floor(Math.random() * 3 + 1),
        sides: [],
      },
      L2: {
        score: Math.floor(Math.random() * 3 + 1),
        miss: Math.floor(Math.random() * 3 + 1),
        sides: [],
      },
      L3: {
        score: Math.floor(Math.random() * 3 + 1),
        miss: Math.floor(Math.random() * 3 + 1),
        sides: [],
      },
      L4: {
        score: Math.floor(Math.random() * 3 + 1),
        miss: Math.floor(Math.random() * 3 + 1),
        sides: [],
      },
    },
    teleReefPick: {
      algea: {
        netScore: Math.floor(Math.random() * 3 + 1),
        netMiss: Math.floor(Math.random() * 3 + 1),
        processor: Math.floor(Math.random() * 3 + 1),
      },
      collected: {
        coralFeeder: Math.random() > 0.5,
        coralGround: Math.random() > 0.5,
        algeaGround: Math.random() > 0.5,
      },
    },
    autoReef: {
      side: "left",
      proximity: "far",
    },
    autoReefLevels: {
      algea: {
        collected: Math.random() > 0.5,
        dropped: Math.random() > 0.5,
      },
      L1: {
        score: Math.floor(Math.random() * 3 + 1),
        miss: Math.floor(Math.random() * 3 + 1),
        sides: [],
      },
      L2: {
        score: Math.floor(Math.random() * 3 + 1),
        miss: Math.floor(Math.random() * 3 + 1),
        sides: [],
      },
      L3: {
        score: Math.floor(Math.random() * 3 + 1),
        miss: Math.floor(Math.random() * 3 + 1),
        sides: [],
      },
      L4: {
        score: Math.floor(Math.random() * 3 + 1),
        miss: Math.floor(Math.random() * 3 + 1),
        sides: [],
      },
    },
    autoReefPick: {
      algea: {
        netScore: Math.floor(Math.random() * 3 + 1),
        netMiss: Math.floor(Math.random() * 3 + 1),
        processor: Math.floor(Math.random() * 3 + 1),
      },
      collected: {
        coralFeeder: Math.random() > 0.5,
        coralGround: Math.random() > 0.5,
        algeaGround: Math.random() > 0.5,
      },
    },
  };
  return match;
};
