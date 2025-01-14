import React from "react";
import ScouterInputs from "../ScouterInputs";
import AutonomousForm from "../AutonomousForm";
import { AutonomousMapInput } from "../input-types/AutonomousMapInput";
interface AutonomousProps {}

const Autonomous: React.FC<AutonomousProps> = () => {
  return (
    <>
      <AutonomousMapInput route={"autonomous"} />
    </>
  );
};

export default Autonomous;
