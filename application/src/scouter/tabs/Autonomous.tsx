import React from "react";
import ScouterInputs from "../ScouterInputs";
interface AutonomousProps {}

const Autonomous: React.FC<AutonomousProps> = () => {
  return ScouterInputs.autoMap.create();
};

export default Autonomous;
