import React from "react";
import ScouterInputs from "../Inputs";
interface AutonomousProps {}

const Autonomous: React.FC<AutonomousProps> = () => {
  return (
    <>
      <div className="map-buttons">
        <div className="speaker-auto">
          <h3>SCORE </h3>
          <br />

          {ScouterInputs.SpeakerAutoScore.create()}
        </div>
        <div className="speaker-auto">
          <h3>MISS</h3>
          <br />

          {ScouterInputs.SpeakerAutoMiss.create()}
        </div>
      </div>
      <br />
    </>
  );
};

export default Autonomous;
