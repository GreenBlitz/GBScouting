import React from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { TeamData } from "../../../TeamData";
import CoralChart from "../../charts/CoralChart";
import LineChart from "../../charts/LineChart";

const StrategyTeleoperated: React.FC = () => {
  const { teamData } = useOutletContext<{ teamData: TeamData }>();
  return (
    <>
      <div className="section">
        <LineChart
          dataSets={{
            Defense: {
              color: "blue",
              data: teamData.getAsLine("defense"),
            },
          }}
        />
      </div>
      <div className="flex flex-col items-center">
        <CoralChart corals={teamData.getAutoCorals()} />
      </div>
    </>
  );
};

export default StrategyTeleoperated;
