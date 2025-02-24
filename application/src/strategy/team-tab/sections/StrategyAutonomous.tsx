import React, { useMemo } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { TeamData } from "../../../TeamData";
import AutoChart from "../../charts/AutoChart";
import CoralChart from "../../charts/CoralChart";
import LineChart from "../../charts/LineChart";
import { matchFieldNames } from "../../../utils/Match";
import { Auto } from "../../../utils/SeasonUI";
import { reefColorsMiss, reefColorsScore } from "./StrategyTeleoperated";

const StrategyAutonomous: React.FC = () => {
  const { teamData } = useOutletContext<{ teamData: TeamData }>();
  const autos: Auto[] = useMemo(() => {
    return teamData?.getAutos();
  }, [teamData]);
  const corals = useMemo(() => {
    return teamData?.getAutoCorals();
  }, [teamData]);
  return (
    <>
      <div className="section">
        <h1>Score</h1>
        <LineChart
          dataSets={Object.assign(
            {},
            ...Object.entries(reefColorsScore).map(([key, value]) => {
              return {
                [key]: {
                  color: value,
                  data: teamData.getAsLine(matchFieldNames.autoReefPick, [
                    "levels",
                    key,
                    "score",
                  ]),
                },
              };
            })
          )}
        />
      </div>
      <div className="section">
        <h1>Miss</h1>
        <LineChart
          dataSets={Object.assign(
            {},
            ...Object.entries(reefColorsMiss).map(([key, value]) => {
              return {
                [key]: {
                  color: value,
                  data: teamData.getAsLine(matchFieldNames.autoReefPick, [
                    "levels",
                    key,
                    "miss",
                  ]),
                },
              };
            })
          )}
        />
      </div>
      <div className="h-48" />
      <div className="flex flex-col items-center">
        <h1 className="text-2xl">Total Corals</h1>
        <CoralChart corals={corals} />
      </div>
      <br />
      <br />
      <h1 className="text-4xl underline">All Autos</h1>
      {autos?.map((auto, index) => (
        <div className="mb-20 mt-5" key={index}>
          <h1 className="text-xl">Qual {auto.qual}</h1>
          <AutoChart auto={auto} />
        </div>
      ))}
    </>
  );
};

export default StrategyAutonomous;
