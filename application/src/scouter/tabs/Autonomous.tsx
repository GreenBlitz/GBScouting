import React from "react";
import ScouterInputs from "../ScouterInputs";
interface AutonomousProps {}

const Autonomous: React.FC<AutonomousProps> = () => {
  return (
    <>
      <div className="map-buttons">
        <div className="speaker-auto">
          <h3>SCORE </h3>
          <br />

          {ScouterInputs.speakerAutoScore.create()}
        </div>
        <div className="speaker-auto">
          <h3>MISS</h3>
          <br />

          {ScouterInputs.speakerAutoMiss.create()}
        </div>
      </div>
      <br />
    </>
  );
};

export default Autonomous;
