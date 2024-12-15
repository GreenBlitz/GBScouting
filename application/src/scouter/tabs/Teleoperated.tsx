import React from "react";
import Queries from "../Queries";

interface TeleoperatedProps {}

const Teleoperated: React.FC<TeleoperatedProps> = () => {
  return <>{Queries.MapPoints.instantiate()}</>;
};

export default Teleoperated;
