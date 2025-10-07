import { Fragment, useEffect, useMemo, useState } from "react";
import MultiProgress from "react-multi-progress";
import { randomColor } from "../../utils/Color";
import { RankingInfo, TeamInfo } from "./Tinder";
import { rankingStorage } from "../../utils/FolderStorage";
import { Notes, TeamNotes } from "../../utils/SeasonUI";
import { defaultNotes } from "../NoteTab";

const calculateValue = (stat: number, percentage: number) =>
  stat * (percentage / 100);

const getTeleopScore = (
  team: TeamInfo,
  teleopSliders: Choice[],
  scoringMethod: ScoringMethod
) => {
  return teleopSliders.reduce(
    (acc, curr) =>
      acc +
      (() => {
        const data =
          scoringMethod === "objectCount"
            ? team.data.getTeleopStats()
            : team.data.getTeleopPointsStats();
        return data[curr.category as keyof typeof data]
          ? calculateValue(
              data[curr.category as keyof typeof data],
              curr.percentage
            )
          : 0;
      })(),
    0
  );
};

const getAutoScore = (
  team: TeamInfo,
  autoSliders: Choice[],
  scoringMethod: ScoringMethod
) => {
  return autoSliders.reduce(
    (acc, curr) =>
      acc +
      (() => {
        const data =
          scoringMethod === "objectCount"
            ? team.data.getAutoStats()
            : team.data.getAutoPointsStats();
        return data[curr.category as keyof typeof data]
          ? calculateValue(
              data[curr.category as keyof typeof data],
              curr.percentage
            )
          : 0;
      })(),
    0
  );
};

export const compileNotes = (teamNotes: TeamNotes) => {
  const length = Object.keys(teamNotes).length;
  const dividing = length > 0 ? length : 1;
  return Object.values(teamNotes).reduce(
    (acc, notes) =>
      Object.entries(notes).reduce((noteAcc, [key, note]) => {
        if (!(key in defaultNotes)) {
          return noteAcc;
        }
        return {
          ...noteAcc,
          [key]: {
            value: note.value + noteAcc[key as keyof Notes].value,
            score: note.score / dividing + noteAcc[key as keyof Notes].score,
          },
        };
      }, acc),
    defaultNotes
  );
};

const getSuperScore = (team: TeamInfo, superSliders: Choice[]) => {
  if (team.stats.Team === 4744) {
    console.log(compileNotes(team.notes));
  }
  return superSliders.reduce(
    (acc, curr) =>
      acc +
      (() => {
        const data = compileNotes(team.notes);
        return data[curr.category as keyof typeof data]
          ? calculateValue(
              data[curr.category as keyof typeof data].score,
              curr.percentage
            )
          : 0;
      })(),
    0
  );
};

const getGameScore = (
  teleopScore: number,
  autoScore: number,
  superScore: number,
  endgameScore: number,
  gameSliders: Choice[]
) => {
  return gameSliders.reduce(
    (acc, curr) =>
      acc +
      (() => {
        if (curr.category === "Teleop")
          return calculateValue(teleopScore, curr.percentage);
        if (curr.category === "Auto")
          return calculateValue(autoScore, curr.percentage);
        if (curr.category === "Super")
          return calculateValue(superScore, curr.percentage);
        if (curr.category === "Endgame")
          return calculateValue(endgameScore, curr.percentage);
        return 0;
      })(),
    0
  );
};

const getEndgameScore = (team: TeamInfo, scoringMethod: ScoringMethod) => {
  return team.stats.Climb / (scoringMethod === "score" ? 1 : 4);
};

const teleopCategories = {
  Algea: "#3cb44b", // Red
  Coral: "#e6194b", // Green
  Net: "#ffe119", // Yellow
  Processor: "#4363d8", // Blue
  L1: "#f58231", // Orange
  L2: "#911eb4", // Purple
  L3: "#46f0f0", // Cyan
  L4: "#f032e6", // Magenta
  LowCoral: "#bcf60c", // Lime
  HighCoral: "#fabebe", // Pink
} as const;

const autoCategories = teleopCategories;

const superCategories = {
  driving: "#34495e",
  defense: "#c0392b",
  evasion: "#7f8c8d",
} as const;

const gameCategories = {
  Teleop: "#16a085",
  Auto: "#2980b9",
  Endgame: "#e74c3c",
  Super: "#7f8c8d",
} as const;

interface InitialRankerProps {
  ranking: TeamInfo[];
  setRanking: (ranking: RankingInfo[]) => void;
}

type ScoringMethod = "score" | "objectCount";
export type ScoreBreakdown = {
  teleop: number;
  auto: number;
  super: number;
  endgame: number;
  game: number;
};
export const InitialRanker: React.FC<InitialRankerProps> = ({
  ranking,
  setRanking,
}) => {
  const [scoringMethod, setScoringMethod] =
    useState<ScoringMethod>("objectCount");

  const getSlidersStorage = (): Record<string, Choice[]> => {
    const stored = rankingStorage.entries();
    return stored
      .map(([key, value]) => ({ [key]: JSON.parse(value || "[]") }))
      .reduce((acc, curr) => ({ ...acc, ...curr }), {});
  };
  const rank = () => {
    const sliders = getSlidersStorage();
    const newRanking = ranking
      .map((team) => ({
        info: team,
        score: score(team, sliders, scoringMethod),
      }))
      .sort((a, b) => b.score.game - a.score.game);

    setRanking(newRanking);
  };

  const score = (
    team: TeamInfo,
    sliders: Record<string, Choice[]>,
    scoringMethod: ScoringMethod
  ): ScoreBreakdown => {
    const autoScore = getAutoScore(team, sliders["Auto"] || [], scoringMethod);
    const teleopScore = getTeleopScore(
      team,
      sliders["Teleop"] || [],
      scoringMethod
    );
    const superScore = getSuperScore(team, sliders["Super"] || []);
    const endgameScore = getEndgameScore(team, scoringMethod);
    return {
      auto: autoScore,
      teleop: teleopScore,
      super: superScore,
      endgame: endgameScore,
      game: getGameScore(
        teleopScore,
        autoScore,
        superScore,
        endgameScore,
        sliders["Game"] || []
      ),
    };
  };

  return (
    <>
      <div className="mb-6">
        <label className="mr-4 font-semibold text-black">Ranking Method:</label>
        <select
          className="border border-gray-300 rounded-md px-2 py-1"
          onChange={(e) => {
            setScoringMethod(e.currentTarget.value as ScoringMethod);
          }}
          defaultValue="objectCount"
        >
          <option value="objectCount">Object Count</option>
          <option value="score">Score</option>
        </select>
      </div>
      <Slider name="Auto" categories={autoCategories} />
      <Slider name="Teleop" categories={teleopCategories} />
      <Slider name="Super" categories={superCategories} />
      <Slider name="Game" categories={gameCategories} />
      <button
        className="ml-2 bg-orange-200 hover:bg-orange-300 text-orange-800 font-bold py-5 px-10 rounded"
        type="button"
        onClick={rank}
      >
        Rank
      </button>
    </>
  );
};

interface SliderProps {
  readonly categories: Record<string, string>;
  name: string;
}

interface Choice {
  category: string;
  percentage: number;
}
const Slider: React.FC<SliderProps> = ({ categories, name }) => {
  const categoryChoices = useMemo(() => Object.keys(categories), [categories]);

  const getStartingChoices = (): Choice[] => {
    const stored = rankingStorage.getItem(name);
    if (stored) {
      return JSON.parse(stored) as Choice[];
    }
    return [
      {
        category: categoryChoices[0],
        percentage: 50,
      },
    ];
  };

  const [currentChoices, setCurrentChoices] = useState<Choice[]>(
    getStartingChoices()
  );

  useEffect(
    () => rankingStorage.setItem(name, JSON.stringify(currentChoices)),
    [currentChoices]
  );

  const addChoice = (choice: Choice) =>
    setCurrentChoices((prev) => [...prev, choice]);
  const removeChoice = (category: string) =>
    setCurrentChoices((prev) => prev.filter((c) => c.category !== category));
  const totalPercentage = useMemo(
    () => currentChoices.reduce((prev, curr) => prev + curr.percentage, 0),
    [currentChoices]
  );

  return (
    <div className="my-10">
      <h1 className="text-2xl font-bold mb-4 text-black">{name}</h1>
      <MultiProgress
        elements={currentChoices.map((choice) => ({
          value: choice.percentage,
          color: categories[choice.category] || randomColor().toString(),
        }))}
        height={70}
      />
      <div className="flex items-center mt-5">
        {currentChoices.map((selectedChoice, index) => (
          <ChoiceItem
            choice={selectedChoice}
            updateChoice={(choice) =>
              setCurrentChoices((prev) => {
                const newPrev = [...prev];
                newPrev[index] = choice;
                return newPrev;
              })
            }
            index={index}
            otherChoices={categoryChoices.filter(
              (category) =>
                !currentChoices.some(
                  (choice, i) => choice.category === category && i !== index
                )
            )}
            totalPercentage={totalPercentage}
            colors={categories}
          />
        ))}
        <button
          className="ml-2 bg-green-200 hover:bg-green-300 text-green-800 font-bold py-2 px-4 rounded"
          type="button"
          onClick={() => {
            const availableCategories = categoryChoices.filter(
              (cat) => !currentChoices.some((choice) => choice.category === cat)
            );
            if (availableCategories.length > 0) {
              addChoice({
                category: availableCategories[0],
                percentage: 100 - totalPercentage,
              });
            }
          }}
          disabled={currentChoices.length >= categoryChoices.length}
        >
          +
        </button>
        {currentChoices.length > 1 && (
          <button
            className="ml-2 bg-red-200 hover:bg-red-300 text-red-800 font-bold py-2 px-4 rounded"
            type="button"
            onClick={() =>
              removeChoice(currentChoices[currentChoices.length - 1].category)
            }
          >
            -
          </button>
        )}
      </div>
    </div>
  );
};

const ChoiceItem: React.FC<{
  readonly choice: Choice;
  updateChoice: (choice: Choice) => void;
  index: number;
  totalPercentage: number;
  otherChoices: string[];
  colors: Record<string, string>;
}> = ({
  choice,
  updateChoice,
  totalPercentage,
  otherChoices,
  index,
  colors,
}) => {
  return (
    <div className="flex flex-row mx-2" key={choice.category}>
      <select
        onChange={(event) =>
          updateChoice({
            category: event.currentTarget.value,
            percentage: choice.percentage,
          })
        }
        id={choice.category + index}
        name={choice.category + index}
        style={{ color: colors[choice.category] }}
      >
        {otherChoices.map((category) => (
          <option
            value={category}
            selected={category === choice.category}
            id={category}
            style={{ color: colors[category] }}
          >
            {category}
          </option>
        ))}
      </select>
      <input
        className="ml-2 border border-gray-300 rounded-md w-20 text-center"
        type="number"
        onChange={(event) =>
          updateChoice({
            category: choice.category,
            percentage: event.currentTarget.valueAsNumber,
          })
        }
        min="0"
        max={100 - totalPercentage + choice.percentage}
        defaultValue={choice.percentage}
        style={{ color: colors[choice.category] }}
      />
    </div>
  );
};
