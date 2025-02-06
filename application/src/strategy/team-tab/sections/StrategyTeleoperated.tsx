import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { TeamData } from "../../../TeamData";
import CoralChart from "../../charts/CoralChart";
import LineChart from "../../charts/LineChart";
import { matchFieldNames } from "../../../utils/Match";
import RadarComponent from "../../charts/RadarChart";

const reefColors = { L1: "green", L2: "red", L3: "yellow", L4: "blue" };

const StrategyTeleoperated: React.FC = () => {
  const { teamData } = useOutletContext<{ teamData: TeamData }>();
  const resistance = useMemo(
    () => teamData.getAverage(matchFieldNames.resistance),
    [teamData]
  );
  const defense = useMemo(
    () => teamData.getAverage(matchFieldNames.defense),
    [teamData]
  );
  return (
    <>
      <div className="section">
        <RadarComponent
          inputs={[
            {
              value: teamData.getAverage(matchFieldNames.teleopReefLevels, [
                "L4",
                "score",
              ]),
              max: 12,
              name: "L4",
            },

            {
              value: teamData.getAverage(matchFieldNames.teleopReefLevels, [
                "L3",
                "score",
              ]),
              max: 12,
              name: "L3",
            },

            {
              value: teamData.getAverage(matchFieldNames.teleopReefLevels, [
                "L2",
                "score",
              ]),
              max: 12,
              name: "L2",
            },
            {
              value: teamData.getAverageReefPickData(
                matchFieldNames.teleReefPick,
                "netScore"
              ),
              max: 18,
              name: "Net",
            },
            {
              value: resistance !== 0 ? 6 - resistance : 0,
              max: 5,
              name: "Resistance",
            },

            { value: teamData.getAverageAutoScore(), max: 50, name: "Auto" },
          ]}
          size={300}
          substeps={5}
        />
      </div>

      <div className="section">
        <RadarComponent
          inputs={[
            {
              value: teamData.getAverage(matchFieldNames.teleopReefLevels, [
                "L1",
                "score",
              ]),
              max: 12,
              name: "L1",
            },
            {
              value: defense !== 0 ? 6 - defense : 0,
              max: 5,
              name: "Defense",
            },

            {
              value: teamData.getAverageReefPickData(
                matchFieldNames.teleReefPick,
                "netScore"
              ),
              max: 18,
              name: "Net",
            },
            { value: teamData.getAverageAutoScore(), max: 50, name: "Auto" },
            {
              value: teamData.getAverageReefPickData(
                matchFieldNames.teleReefPick,
                "processor"
              ),

              max: 12,
              name: "Processor",
            },
          ]}
          size={300}
          substeps={5}
        />
      </div>
      <br />
      <div className="section">
        <LineChart
          dataSets={{
            Defense: {
              color: "purple",
              data: teamData.getAsLine(matchFieldNames.defense),
            },

            Resistance: {
              color: "pink",
              data: teamData.getAsLine(matchFieldNames.resistance),
            },
          }}
        />
      </div>
      <div className="section">
        <LineChart
          dataSets={{
            Score: {
              color: "green",
              data: teamData.getAlgeaDataAsLine(
                matchFieldNames.teleReefPick,
                "netScore"
              ),
            },
            Miss: {
              color: "red",
              data: teamData.getAlgeaDataAsLine(
                matchFieldNames.teleReefPick,
                "netMiss"
              ),
            },
          }}
        />
      </div>
      <div className="section">
        <LineChart
          dataSets={{
            Processor: {
              color: "yellow",
              data: teamData.getAlgeaDataAsLine(
                matchFieldNames.teleReefPick,
                "processor"
              ),
            },
          }}
        />
      </div>
      <br />

      <div className="section">
        <h1>Score</h1>
        <LineChart
          dataSets={Object.assign(
            {},
            ...Object.entries(reefColors).map(([key, value]) => {
              return {
                [key]: {
                  color: value,
                  data: teamData.getAsLine(matchFieldNames.teleopReefLevels, [
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
            ...Object.entries(reefColors).map(([key, value]) => {
              return {
                [key]: {
                  color: value,
                  data: teamData.getAsLine(matchFieldNames.teleopReefLevels, [
                    key,
                    "miss",
                  ]),
                },
              };
            })
          )}
        />
      </div>

      <br />
      <div className="section">
        <LineChart
          dataSets={{
            "Total Score": { color: "red", data: teamData.getScores() },
          }}
        />
      </div>

      <div className="h-48" />

      <div className="flex flex-col items-center">
        <h1 className="text-2xl">Corals</h1>
        <CoralChart corals={teamData.getTeleopCorals()} />
      </div>
    </>
  );
};

export default StrategyTeleoperated;
