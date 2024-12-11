import React from "react";
import MapQuery from "../querytypes/MapQuery";
import Queries from "../Queries";

interface TeleoperatedProps {}

const Teleoperated: React.FC<TeleoperatedProps> = () => {
  return (
    <>
      <MapQuery
        name={"CRESCENDO"}
        side={
          Queries.GameSide.get() === "Red" ? "red" : "blue"
        }
        width={540 * 0.8}
        height={240 * 0.8}
        imagePath={"./src/assets/Crescendo Map.png"}
      />
    </>
  );
};

export default Teleoperated;
