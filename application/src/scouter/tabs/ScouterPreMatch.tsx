import React from "react";
import ScouterInputs from "../ScouterInputs";

interface PreGameProps {}

const ScouterPreMatch: React.FC<PreGameProps> = () => {
  return (
    <>
      {ScouterInputs.create([
        ScouterInputs.scouterName,
        ScouterInputs.qual,
        ScouterInputs.teamNumber,
        ScouterInputs.gameSide,
        ScouterInputs.startingPosition,
        ScouterInputs.noShow,
      ])}
    </>
  );
};

export default ScouterPreMatch;
