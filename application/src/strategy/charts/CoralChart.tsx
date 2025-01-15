import React, { useEffect, useState } from "react";
import { Level, Levels } from "../../components/ReefForm";
import PercentageBarChart from "./PercentageBarChart";

interface CoralChartProps {
  corals: Levels;
}

//😭😭😭 bruh what is this???? stupidest code i wrote. no way this going through CR
const CoralChart: React.FC<CoralChartProps> = ({ corals }) => {
  const [coralElements, setCorals] = useState<React.JSX.Element[]>([]);

  function createCoralElemnt(coralLevel: Level, levelName: string) {
    const scorePercentage =
      (coralLevel.score / (coralLevel.score + coralLevel.miss)) * 100;

    return (
      <React.Fragment key={levelName}>
        <h2>{levelName}</h2>
        <h3>Score: {coralLevel.score}</h3>
        <h3>Miss: {coralLevel.miss}</h3>
        <PercentageBarChart
          width={300}
          height={150}
          sections={[
            {
              name: "Score",
              value: scorePercentage,
              color: "green",
            },
            { name: "Miss", value: 100 - scorePercentage, color: "red" },
          ]}
        />
      </React.Fragment>
    );
  }

  useEffect(() => {
    if (coralElements.length < Object.keys(corals).length) {
      console.log(coralElements);
      const coralLevel = corals[Object.keys(corals)[coralElements.length]];
      setCorals([
        ...coralElements,
        createCoralElemnt(
          coralLevel,
          Object.keys(corals)[coralElements.length]
        ),
      ]);
    }
  }, [coralElements]);

  return <>{coralElements}</>;
};

export default CoralChart;
