import React from "react";
import MapQuery from "../querytypes/MapQuery";
import Queries from "../Queries";
import { queryFolder } from "../../utils/FolderStorage";

interface TeleoperatedProps {}

const Teleoperated: React.FC<TeleoperatedProps> = () => {
  return (
    <>
      {Queries.MapPoints.Instantiate()}
    </>
  );
};

export default Teleoperated;
