import { Fragment, useMemo, useState } from "react";
import MultiProgress from "react-multi-progress";
import { randomColor } from "../../utils/Color";

const teleopCategories = {
  Algea: "#3cb44b", // Red
  Corals: "#e6194b", // Green
  Net: "#ffe119", // Yellow
  Processor: "#4363d8", // Blue
  L1: "#f58231", // Orange
  L2: "#911eb4", // Purple
  L3: "#46f0f0", // Cyan
  L4: "#f032e6", // Magenta
} as const;

const autoCategories = {
  Algea: "#27ae60",
  Corals: "#2980b9",
  Net: "#8e44ad",
  Processor: "#2ecc71",
  L1: "#f39c12",
  L2: "#d35400",
} as const;

const superCategories = {
  Driving: "#34495e",
  Defense: "#c0392b",
  Evasion: "#7f8c8d",
} as const;

const gameCategories = {
  Teleop: "#16a085",
  Auto: "#2980b9",
  Endgame: "#e74c3c",
  Super: "#7f8c8d",
} as const;

export const InitialRanker: React.FC<any> = () => {
  return (
    <>
      <Slider name="Auto" categories={autoCategories} />
      <Slider name="Teleop" categories={teleopCategories} />
      <Slider name="Super" categories={superCategories} />
      <Slider name="Game" categories={gameCategories} />
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
  const [currentChoices, setCurrentChoices] = useState<Choice[]>([
    {
      category: categoryChoices[0],
      percentage: 100,
    },
  ]);

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
}> = ({ choice, updateChoice, totalPercentage, otherChoices, index }) => {
  return (
    <div className="flex flex-row mx-5" key={choice.category}>
      <select
        onChange={(event) =>
          updateChoice({
            category: event.currentTarget.value,
            percentage: choice.percentage,
          })
        }
        id={choice.category + index}
        name={choice.category + index}
      >
        {otherChoices.map((category) => (
          <option
            value={category}
            selected={category === choice.category}
            id={category}
          >
            {category}
          </option>
        ))}
      </select>
      <input
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
      />
    </div>
  );
};
