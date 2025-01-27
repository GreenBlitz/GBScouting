import React, { useMemo } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { TeamData } from "../../../TeamData";
import AutoChart from "../../charts/AutoChart";
import CoralChart from "../../charts/CoralChart";

const StrategyAutonomous: React.FC = () => {
  const { teamData } = useOutletContext<{ teamData: TeamData }>();
  const autos = useMemo(() => {
    return teamData?.getAutos();
  }, [teamData]);
  const corals = useMemo(() => {
    return teamData?.getAutoCorals();
  }, [teamData]);
  return (
    <>
        <CoralChart corals={corals} />
      <br />
      <br />
      <h1 className="text-4xl underline">All Autos</h1>
      {autos?.map((auto, index) => (
        <div key={index}>
          <AutoChart auto={auto} />
        </div>
      ))}
    </>
  );
};

export default StrategyAutonomous;
