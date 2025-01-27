import React, { useMemo } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { TeamData } from "../../../TeamData";
import AutoChart from "../../charts/AutoChart";

const StrategyAutonomous: React.FC = () => {
  const { teamData } = useOutletContext<{ teamData: TeamData }>();
  const autos = useMemo(() => {
    return teamData?.getAutos();
  }, [teamData]);
  return (
    <>
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
