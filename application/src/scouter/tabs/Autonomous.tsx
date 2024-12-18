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

          {Inputs.SpeakerAutoScore.create()}
        </div>
        <div className="speaker-auto">
          <h3>MISS</h3>
          <br />

          {Inputs.SpeakerAutoMiss.create()}
        </div>
      </div>
      <br />
    </>
  );
};

export default Autonomous;
