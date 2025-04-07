import React, { useMemo } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { TeamData } from "../../../TeamData";
import AutoChart from "../../charts/AutoChart";
import CoralChart from "../../charts/CoralChart";
import LineChart from "../../charts/LineChart";
import { matchFieldNames } from "../../../utils/Match";
import { Auto } from "../../../utils/SeasonUI";
import {
  isLineChartStorage,
  reefColorsMiss,
  reefColorsScore,
} from "./StrategyTeleoperated";
import BarChart from "../../charts/BarChart";
import NetChart from "../../charts/NetChart";

const StrategyAutonomous: React.FC = () => {
  const { teamData } = useOutletContext<{ teamData: TeamData }>();
  const autos: Auto[] = useMemo(() => {
    return teamData?.getAutos();
  }, [teamData]);
  const corals = useMemo(() => {
    return teamData?.getAutoCorals();
  }, [teamData]);

  const scoringDataSet = useMemo(() => {
    return {
      ...Object.fromEntries(
        Object.entries(reefColorsScore).map(([key, value]) => [
          key,
          {
            color: value,
            data: teamData.getAsLine(matchFieldNames.autoReefPick, [
              "levels",
              key,
              "score",
            ]),
          },
        ])
      ),
      Net: {
        color: "#172db8",
        data: teamData.getAlgeaDataAsLine(
          matchFieldNames.autoReefPick,
          "netScore"
        ),
      },
      Processor: {
        color: "#8fb4ff",
        data: teamData.getAlgeaDataAsLine(
          matchFieldNames.autoReefPick,
          "processor"
        ),
      },
    };
  }, [teamData]);

  const missDataSet = useMemo(() => {
    return {
      ...Object.fromEntries(
        Object.entries(reefColorsMiss).map(([key, value]) => [
          key,
          {
            color: value,
            data: teamData.getAsLine(matchFieldNames.autoReefPick, [
              "levels",
              key,
              "miss",
            ]),
          },
        ])
      ),
      Net: {
        color: "#b81616",
        data: teamData.getAlgeaDataAsLine(
          matchFieldNames.autoReefPick,
          "netMiss"
        ),
      },
    };
  }, [teamData]);

  const isLineChart = isLineChartStorage.get();
  return (
    <>
      <div className="section">
        <h1>Score</h1>
        {isLineChart ? (
          <LineChart dataSets={scoringDataSet} />
        ) : (
          <BarChart dataSets={scoringDataSet} isStacked={true} />
        )}
      </div>
      <div className="section">
        <h1>Miss</h1>
        {isLineChart ? (
          <LineChart dataSets={missDataSet} />
        ) : (
          <BarChart dataSets={missDataSet} isStacked={true} />
        )}
      </div>
      <h1>Started At Middle On: {teamData.getMiddleQuals().toString()}</h1>
      <div className="h-48" />
      <div className="flex flex-col items-center">
        <h1 className="text-2xl">Total Corals</h1>
        <CoralChart corals={corals} />
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-2xl">Net stats</h1>
        <NetChart algaes={teamData.getAutopNet()} />
      </div>
    </>
  );
};

export default StrategyAutonomous;
