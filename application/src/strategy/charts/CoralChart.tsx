import React, { useEffect, useMemo, useState } from "react";
import { Level, Levels } from "../../components/ReefForm";
import PercentageBarChart from "./PercentageBarChart";
import Percent from "../../utils/Percent";

interface CoralChartProps {
  corals: Levels;
}

//😭😭😭 bruh what is this???? stupidest code i wrote. no way this going through CR
const CoralChart: React.FC<CoralChartProps> = ({ corals }) => {
  const [coralElements, setCorals] = useState<React.JSX.Element[]>([]);

  function createCoralElement(coralLevel: Level, levelName: string) {
    const scorePercentage: Percent = Percent.fromRatio(
      coralLevel.score,
      coralLevel.miss + coralLevel.score
    );

    if (isNaN(scorePercentage.value)) {
      return <></>;
    }

    return (
      <>
        <div key={levelName} className="flex flex-row items-center">
          <h2 className="mr-2.5 text-xl mb-0">{levelName}</h2>
          <div>
            <div className="flex flex-row justify-center pt-5">
              <h3 className="mr-2.5 mb-0">Score: {coralLevel.score}</h3>
              <h3 className="mr-2.5 mb-0">Miss: {coralLevel.miss}</h3>
            </div>
            <PercentageBarChart
              width={300}
              height={150}
              sections={[
                { name: "Score", value: scorePercentage.value, color: "green" },
                {
                  name: "Miss",
                  value: scorePercentage.complement,
                  color: "red",
                },
              ]}
              isAlwaysHovered={true}
            />
          </div>
        </div>
      </>
    );
  }

  useEffect(() => {
    const coralLevels = Object.values(corals).reverse();
    if (coralElements.length < coralLevels.length) {
      const coralLevel = coralLevels[coralElements.length];
      setCorals([
        ...coralElements,
        createCoralElement(
          coralLevel,
          Object.keys(corals).reverse()[coralElements.length]
        ),
      ]);
    }
  }, [coralElements]);

  return <>{coralElements}</>;
};

export default CoralChart;
