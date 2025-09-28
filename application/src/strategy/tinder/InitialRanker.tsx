import { Fragment, useState } from "react";

const teleopCategories = [
  "Algea",
  "Corals",
  "Climb",
  "Defense",
  "Evasion",
  "Net",
  "Processor",
  "L1",
  "L2",
  "L3",
  "L4",
];

export const InitialRanker: React.FC<any> = () => {
  return <Slider categoryChoices={teleopCategories}></Slider>;
};

interface SliderProps {
  readonly categoryChoices: string[];
}

interface Choice {
  category: string;
  percentage: number;
}
const Slider: React.FC<SliderProps> = ({ categoryChoices }) => {
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

  return (
    <div className="flex items-center">
      {currentChoices.map((selectedChoice, index) => (
        <div className="flex flex-row mx-5" key={selectedChoice.category}>
          <select
            onChange={(event) =>
              setCurrentChoices((prev) => {
                prev[index] = {
                  category: event.currentTarget.value,
                  percentage: prev[index].percentage,
                };
                return prev;
              })
            }
            id={index.toString()}
            name={index.toString()}
          >
            {categoryChoices
              .filter(
                (category) =>
                  !currentChoices.some(
                    (choice, i) => choice.category === category && i !== index
                  )
              )
              .map((category) => (
                <option
                  value={category}
                  selected={category === selectedChoice.category}
                >
                  {category}
                </option>
              ))}
          </select>
          <input
            type="number"
            onChange={(event) =>
              setCurrentChoices((prev) => {
                prev[index].percentage = parseInt(event.currentTarget.value);
                return prev;
              })
            }
            min="0"
            max="100"
            defaultValue={selectedChoice.percentage}
          />
        </div>
      ))}
      <button
        className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded"
        type="button"
        onClick={() => {
          const availableCategories = categoryChoices.filter(
            (cat) => !currentChoices.some((choice) => choice.category === cat)
          );
          if (availableCategories.length > 0) {
            addChoice({ category: availableCategories[0], percentage: 100 });
          }
        }}
        disabled={currentChoices.length >= categoryChoices.length}
      >
        +
      </button>
      {currentChoices.length > 1 && (
        <button
          className="ml-2 bg-red-200 hover:bg-red-300 text-red-800 font-bold py-1 px-2 rounded"
          type="button"
          onClick={() =>
            removeChoice(currentChoices[currentChoices.length - 1].category)
          }
        >
          -
        </button>
      )}
    </div>
  );
};
