import React from "react";
import ScouterInputs from "../ScouterInputs";

interface PreGameProps {}

const PreMatch: React.FC<PreGameProps> = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      {ScouterInputs.create([
        ScouterInputs.scouterName,
        ScouterInputs.qual,
        ScouterInputs.teamNumber,
        ScouterInputs.gameSide,
        ScouterInputs.startingPosition,
      ])}
    </div>
  );
};

export default PreMatch;
