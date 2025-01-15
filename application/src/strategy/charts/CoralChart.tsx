import React from "react";
import { Levels } from "../../components/ReefForm";
import PercentageBarChart from "./PercentageBarChart";

interface CoralChartProps {
  corals: Levels;
}

const CoralChart: React.FC<CoralChartProps> = ({ corals }) => {
  return (
    <>
      {Object.keys(corals).map((levelName) => {
        const scorePercentage =
          (corals[levelName].score /
            (corals[levelName].score + corals[levelName].miss)) *
          100;
        return (
          <React.Fragment key={levelName}>
            <h2>{levelName}</h2>
            <h3>Score: {corals[levelName].score}</h3>
            <h3>Miss: {corals[levelName].miss}</h3>
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
      })}
    </>
  );
};

export default CoralChart;
