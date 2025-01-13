import React, {useState} from "react";
import SushiButton from "./SushiButton";
import { AllSushis, Sushi, ValuesToBePassed } from "./input-types/AutonomousMapInput";
import {ShusiToBeChanged} from "./input-types/AutonomousMapInput"


const AutonomousForm: React.FC<AllSushis> = (props) => {
  const sushiButtons = [<SushiButton />, <SushiButton/>, <SushiButton/>];
  const buttons = (
    <div className="sushi-buttons">
      {sushiButtons}
    </div>
  );

  const blueAllienceAutonomousMap = (
    <div className="field-container">
      <img
        src="/src/assets/blue-auto-map.png"
        alt="Field"
        style={{ width: "70%" }}
      ></img>
      {buttons}
    </div>
  );

  return <>{blueAllienceAutonomousMap}</>;
};
export default AutonomousForm;
