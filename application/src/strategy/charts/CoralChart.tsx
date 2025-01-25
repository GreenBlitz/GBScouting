import React, { useEffect, useState } from "react";
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

    return (
      <div key={levelName} style={{ display: "flex", alignItems: "center" }}>
        <h2 style={{ margin: "0 10px 0 0" }}>{levelName}</h2>
        <h3 style={{ margin: "0 10px 0 0" }}>Score: {coralLevel.score}</h3>
        <h3 style={{ margin: "0 10px 0 0" }}>Miss: {coralLevel.miss}</h3>
        <PercentageBarChart
          width={300}
          height={150}
          sections={[
            { name: "Score", value: scorePercentage.value, color: "green" },
            { name: "Miss", value: scorePercentage.complement, color: "red" },
          ]}
        />
      </div>
    );
  }

  useEffect(() => {
    const coralLevels = Object.values(corals);
    if (coralElements.length < coralLevels.length) {
      const coralLevel = coralLevels[coralElements.length];
      setCorals([
        ...coralElements,
        createCoralElement(
          coralLevel,
          Object.keys(corals)[coralElements.length]
        ),
      ]);
    }
  }, [coralElements]);

  return <>{coralElements}</>;
};

export default CoralChart;
