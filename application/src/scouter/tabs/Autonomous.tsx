import React, { useRef } from "react";
import CounterQuery from "../querytypes/CounterQuery";
import AutoMap from "../querytypes/AutoMap";
interface AutonomousProps {}

const Autonomous: React.FC<AutonomousProps> = () => {
  const imagePath = "./src/assets/Crescendo Map.png";

  return (
    <>
      <div className="map-buttons">
        <div className="speaker-auto">
          <CounterQuery name={"Speaker/Auto/Score"} color="#12a119" />
          <h3>SCORE </h3>
        </div>
        <div className="speaker-auto">
          <CounterQuery name={"Speaker/Auto/Miss"} color="#8f0a0e" />
          <h3>MISS</h3>
        </div>
      </div>
      <br />
      <AutoMap
        imagePath={imagePath}
        side={
          localStorage.getItem("Queries/Game Side") === "Red" ? "red" : "blue"
        }
      />
    </>
  );
};

export default Autonomous;
