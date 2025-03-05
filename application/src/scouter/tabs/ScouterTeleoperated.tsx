import React from "react";
import ScouterInputs from "../ScouterInputs";
import { Outlet } from "react-router-dom";

const ScouterTeleoperated: React.FC = () => {
  return <Outlet />;
};

export const ScouterTelePick: React.FC = () => {
  return ScouterInputs.teleReefPick.create();
};

export default ScouterTeleoperated;
