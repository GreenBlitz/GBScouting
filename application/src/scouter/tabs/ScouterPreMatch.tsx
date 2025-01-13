import React from "react";
import ScouterInputs from "../ScouterInputs";


const ScouterPreMatch: React.FC = () => {
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
