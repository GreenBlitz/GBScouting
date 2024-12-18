import React from "react";
import Inputs from "../Inputs";

interface TeleoperatedProps {}

const Teleoperated: React.FC<TeleoperatedProps> = () => {
  return <>{Inputs.MapPoints.create()}</>;
};

export default Teleoperated;
