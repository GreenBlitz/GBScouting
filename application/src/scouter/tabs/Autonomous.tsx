import React, { useRef } from "react";
import CounterQuery from "../querytypes/CounterQuery";
import { Queries } from "../../utils/FolderStorage";
interface AutonomousProps {}

const Autonomous: React.FC<AutonomousProps> = () => {
  return (
    <>
      <div className="map-buttons">
        <div className="speaker-auto">
          <h3>SCORE </h3>
          <br />

          <CounterQuery storage={Queries.SpeakerAutoScore} color="#12a119" />
        </div>
        <div className="speaker-auto">
          <h3>MISS</h3>
          <br />

          <CounterQuery storage={Queries.SpeakerAutoMiss} color="#8f0a0e" />
        </div>
      </div>
      <br />
    </>
  );
};

export default Autonomous;
