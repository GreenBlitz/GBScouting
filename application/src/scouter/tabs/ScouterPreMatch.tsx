import React from "react";
import ScouterInputs from "../ScouterInputs";


const ScouterPreMatch: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      {ScouterInputs.create([
        ScouterInputs.scouterName,
        ScouterInputs.qual,
        ScouterInputs.teamNumber,
        ScouterInputs.gameSide,
        ScouterInputs.startingPosition,
        ScouterInputs.noShow,
      ])}
    </div>
  );
};

export default ScouterPreMatch;
