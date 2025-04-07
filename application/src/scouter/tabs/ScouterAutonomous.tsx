import React from "react";
import ScouterInputs from "../ScouterInputs";
import { Outlet } from "react-router-dom";

const ScouterAutonomous: React.FC = () => {
  return <Outlet />;
};

export const ScouterAutoPick: React.FC = () => {
  return ScouterInputs.autoReefPick.create();
};

export default ScouterAutonomous;
