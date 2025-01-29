import React from "react";
import { useOutletContext } from "react-router-dom";
import { TeamData } from "../../../TeamData";
import CoralChart from "../../charts/CoralChart";
import LineChart from "../../charts/LineChart";
import { matchFieldNames } from "../../../utils/Match";

const reefColors = { L1: "green", L2: "red", L3: "yellow", L4: "blue" };

const StrategyTeleoperated: React.FC = () => {
  const { teamData } = useOutletContext<{ teamData: TeamData }>();
  return (
    <>
      <div className="section">
        <LineChart
          dataSets={{
            Defense: {
              color: "blue",
              data: teamData.getAsLine(matchFieldNames.defense),
            },
          }}
        />
      </div>
      <div className="section">
        <LineChart
          dataSets={{
            Score: {
              color: "green",
              data: teamData.getAsLine(matchFieldNames.teleopReef, [
                "net",
                "score",
              ]),
            },
            Miss: {
              color: "red",
              data: teamData.getAsLine(matchFieldNames.teleopReef, [
                "net",
                "miss",
              ]),
            },
          }}
        />
      </div>
      <div className="section">
        <LineChart
          dataSets={{
            Proccessor: {
              color: "yellow",
              data: teamData.getAsLine(matchFieldNames.teleopReef, [
                "proccessor",
              ]),
            },
          }}
        />
      </div>
      <div className="section">
        <LineChart
          dataSets={Object.assign(
            {},
            ...Object.entries(reefColors).map(([key, value]) => {
              return {
                [key]: {
                  color: value,
                  data: teamData.getAsLine(matchFieldNames.teleopReef, [
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
        <LineChart
          dataSets={Object.assign(
            {},
            ...Object.entries(reefColors).map(([key, value]) => {
              return {
                [key]: {
                  color: value,
                  data: teamData.getAsLine(matchFieldNames.teleopReef, [
                    key,
                    "miss",
                  ]),
                },
              };
            })
          )}
        />
      </div>

      <div className="flex flex-col items-center">
        <CoralChart corals={teamData.getAutoCorals()} />
      </div>
    </>
  );
};

export default StrategyTeleoperated;
