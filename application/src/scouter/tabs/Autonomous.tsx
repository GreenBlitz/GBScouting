import React, { useRef } from "react";
import CounterQuery from "../querytypes/CounterQuery";
import Queries from "../Queries";
interface AutonomousProps {}

const Autonomous: React.FC<AutonomousProps> = () => {
  return (
    <>
      <div className="map-buttons">
        <div className="speaker-auto">
          <h3>SCORE </h3>
          <br />

          {Queries.SpeakerAutoScore.render()}
        </div>
        <div className="speaker-auto">
          <h3>MISS</h3>
          <br />

          {Queries.SpeakerAutoMiss.render()}
        </div>
      </div>
      <br />
    </>
  );
};

export default Autonomous;
