import React from "react";
import Inputs from "../Inputs";

interface TeleoperatedProps {}

const Teleoperated: React.FC<TeleoperatedProps> = () => {
  return <>{Inputs.MapPoints.instantiate()}</>;
};

export default Teleoperated;
