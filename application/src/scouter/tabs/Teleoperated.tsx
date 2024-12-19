import React from "react";
import ScouterInputs from "../ScouterInputs";

interface TeleoperatedProps {}

const Teleoperated: React.FC<TeleoperatedProps> = () => {
  return <>{ScouterInputs.mapPoints.create()}</>;
};

export default Teleoperated;
