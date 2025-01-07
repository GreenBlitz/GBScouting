import React, { useState } from "react";
import CoralButton from "./CoralButton";
import AlgaeButton from "./AlgaeButton";

const AutonomousForm: React.FC = () => {
  const coralButtons = [<CoralButton />, <CoralButton />, <CoralButton />];
  const AlgaeButtons = [<AlgaeButton />, <AlgaeButton />, <AlgaeButton />];
  const buttons = (
    <div
      className="buttons"
      style={{ display: "grid", gridTemplateColumns: "auto auto" }}
    >
      {coralButtons.map((CoralButton) => CoralButton)}
      {AlgaeButtons.map((AlgaeButton) => AlgaeButton)}
    </div>
  );

  const blueAllienceAutonomousMap = (
    <div className="container">
      <img
        src="\src\assets\blue-auto-map.png"
        alt=""
        style={{ width: "40%", height: "40%" }}
      ></img>
      {buttons}
    </div>
  );

  return <>{blueAllienceAutonomousMap}</>;
};
export default AutonomousForm;
