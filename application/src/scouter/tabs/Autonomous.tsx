import React from "react";
import ScouterInputs from "../ScouterInputs";
import AutonomousForm from "../AutonomousForm";
import { AutonomousMapInput } from "../input-types/auto-map/AutonomousMapInput";
interface AutonomousProps {}

const Autonomous: React.FC<AutonomousProps> = () => {
  return ScouterInputs.autoMap.create();
};

export default Autonomous;
