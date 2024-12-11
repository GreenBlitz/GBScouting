import React from "react";
import MapQuery from "../querytypes/MapQuery";
import Queries from "../Queries";
import { queryFolder } from "../../utils/FolderStorage";

interface TeleoperatedProps {}

const Teleoperated: React.FC<TeleoperatedProps> = () => {
  return (
    <>
      <MapQuery
        name={"Map"}
        side={
          queryFolder.getItem(Queries.GameSide.props.name) as ("Blue" | "Red")
        }
        width={540 * 0.8}
        height={240 * 0.8}
        imagePath={"./src/assets/Crescendo Map.png"}
      />
    </>
  );
};

export default Teleoperated;
