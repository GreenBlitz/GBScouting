import React from "react";
import Inputs from "../Inputs";
interface AutonomousProps {}

const Autonomous: React.FC<AutonomousProps> = () => {
  return (
    <>
      <div className="map-buttons">
        <div className="speaker-auto">
          <h3>SCORE </h3>
          <br />

          {Inputs.SpeakerAutoScore.instantiate()}
        </div>
        <div className="speaker-auto">
          <h3>MISS</h3>
          <br />

          {Inputs.SpeakerAutoMiss.instantiate()}
        </div>
      </div>
      <br />
    </>
  );
};

export default Autonomous;
