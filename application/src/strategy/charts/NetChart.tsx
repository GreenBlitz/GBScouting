import React, { useEffect, useMemo, useState } from "react";
import PercentageBarChart from "./PercentageBarChart";
import Percent from "../../utils/Percent";
import {
  Level,
  Levels,
} from "../../scouter/input-types/reef-levels/ReefPickInput";
import { UsedAlgea } from "../../utils/SeasonUI";

interface CoralChartProps {
  algaes: UsedAlgea;
}

//😭😭😭 bruh what is this???? stupidest code i wrote. no way this going through CR
const NetChart: React.FC<CoralChartProps> = ({ algaes }) => {
  const [netElements, setNet] = useState<React.JSX.Element[]>([]);

  function createCoralElement() {
    const scorePercentage: Percent = Percent.fromRatio(
      algaes.netScore,
      algaes.netMiss+algaes.netScore
    );

    if (isNaN(scorePercentage.value)) {
      return <></>;
    }

    return (
      <>
        <div key={"Net"} className="flex flex-row items-center">
          <h2 className="mr-2.5 text-xl mb-0">{"Net"}</h2>
          <div>
            <div className="flex flex-row justify-center pt-5">
              <h3 className="mr-2.5 mb-0">Score: {algaes.netScore}</h3>
              <h3 className="mr-2.5 mb-0">Miss: {algaes.netMiss}</h3>
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
    setNet([]);
  }, [algaes]);

  useEffect(() => {
    const coralLevels = Object.values(algaes).reverse();
    if (netElements.length < coralLevels.length) {
      const coralLevel = coralLevels[netElements.length];
      setNet([
        ...netElements,
        createCoralElement(),
      ]);
    }
  }, [netElements]);

  return <>{netElements}</>;
};

export default NetChart;
