import React from "react";
import ScouterInputs from "../ScouterInputs";

interface PreGameProps {}

const PreMatch: React.FC<PreGameProps> = () => {
  return (
    <>
      {ScouterInputs.create([
        ScouterInputs.ScouterName,
        ScouterInputs.Qual,
        ScouterInputs.TeamNumber,
        ScouterInputs.GameSide,
        ScouterInputs.StartingPosition,
      ])}
    </>
  );
};

export default PreMatch;
