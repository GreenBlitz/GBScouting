import React from "react";
import Inputs from "../Inputs";

interface PreGameProps {}

const PreMatch: React.FC<PreGameProps> = () => {
  return (
    <>
      {Inputs.create([
        Inputs.ScouterName,
        Inputs.Qual,
        Inputs.TeamNumber,
        Inputs.GameSide,
        Inputs.StartingPosition,
      ])}
    </>
  );
};

export default PreMatch;
