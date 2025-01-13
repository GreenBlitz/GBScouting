import React from "react";
import ScouterInputs from "../ScouterInputs";
import ReefForm from "../../components/ReefForm";


const undoButton = new UndoButton<string>("Initial Value");
interface TeleoperatedProps {}

const Teleoperated: React.FC<TeleoperatedProps> = () => {
  return(
  <>
  {ScouterInputs.reefForm.create()}
  <button onClick={() => undoButton.undo(ReefForm.handleUndo())}>Undo</button>

  

  </> 
  );
};

export default Teleoperated;
