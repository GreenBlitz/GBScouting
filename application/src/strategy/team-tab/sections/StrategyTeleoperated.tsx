import React from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { TeamData } from "../../../TeamData";
import CoralChart from "../../charts/CoralChart";

const StrategyTeleoperated: React.FC = () => {
  const { teamData } = useOutletContext<{ teamData: TeamData }>();
  return (
    <CoralChart
      corals={{
        L1: { score: 1, miss: 1 },
        L2: { score: 3, miss: 2 },
        L3: { score: 8, miss: 3 },
        L4: { score: 6, miss: 6 },
      }}
    />
  );
};

export default StrategyTeleoperated;
