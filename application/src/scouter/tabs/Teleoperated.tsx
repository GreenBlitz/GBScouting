import React from "react";
import ScouterInputs from "../ScouterInputs";

interface TeleoperatedProps {}

const Teleoperated: React.FC<TeleoperatedProps> = () => {
  return <>{ScouterInputs.MapPoints.create()}</>;
};

export default Teleoperated;
