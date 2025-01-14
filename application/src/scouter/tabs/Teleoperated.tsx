import React from "react";
import ScouterInputs from "../ScouterInputs";
import ReefForm from "../../components/ReefForm";

import teleopForm from "../../components/teleopForm.tsx";

interface TeleoperatedProps {}

interface Level {
  score: number;
  miss: number;
}

interface Levels {
  L1: Level;
  L2: Level;
  L3: Level;
  L4: Level;
}
interface undoAction{
  level: keyof Levels;
  point: keyof Level;
}


const Teleoperated: React.FC<TeleoperatedProps> = () => {
  return(
  <>
  {ScouterInputs.teleopForm.create()}

  </> 
  );
};

export default Teleoperated;
