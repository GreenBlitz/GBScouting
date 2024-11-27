import React from "react";
import MapQuery from "../querytypes/MapQuery";
import { queryFolder } from "../../utils/FolderStorage";

interface TeleoperatedProps {}

const Teleoperated: React.FC<TeleoperatedProps> = () => {
  return (
    <>
      <MapQuery
        name={"CRESCENDO"}
        side={
          queryFolder.getItem("Game Side") === "Red" ? "red" : "blue"
        }
        width={540 * 0.8}
        height={240 * 0.8}
        imagePath={"./src/assets/Crescendo Map.png"}
      />
    </>
  );
};

export default Teleoperated;
