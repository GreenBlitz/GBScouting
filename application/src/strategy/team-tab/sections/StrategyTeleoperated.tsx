import React from "react";
import { useLocation } from "react-router-dom";
import { TeamData } from "../../../TeamData";

const StrategyTeleoperated: React.FC = () => {
  const location = useLocation();
  const teamData: TeamData | undefined = location.state;
  return <></>;
};

export default StrategyTeleoperated;
