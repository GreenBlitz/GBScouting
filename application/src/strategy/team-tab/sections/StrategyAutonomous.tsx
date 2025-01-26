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
      {autos?.map((auto, index) => (
        <div className="auto-chart" key={index}>
          <AutoChart auto={auto} />
          <div>
            <h2>Times Done: {auto.occurances}</h2>
          </div>
        </div>
      ))}
    </>
  );
};

export default StrategyAutonomous;
