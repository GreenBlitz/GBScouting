import React, {useState} from "react";
import SushiButton from "./SushiButton";
import { AllSushis, AllSushisAndStorage, Sushi, ValuesToBePassed } from "./input-types/AutonomousMapInput";
import {ShusiToBeChanged} from "./input-types/AutonomousMapInput"


const AutonomousForm: React.FC<AllSushisAndStorage> = (props) => {
  const sushiButtons = [<SushiButton sushies={props.allSushis} sushiToBeChanged={ShusiToBeChanged.SUSHI1} storage={props.storage} />,
     <SushiButton sushies={props.allSushis} sushiToBeChanged={ShusiToBeChanged.SUSHI2} storage={props.storage} />,
     <SushiButton sushies={props.allSushis} sushiToBeChanged={ShusiToBeChanged.SUSHI3} storage={props.storage}/>];
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
