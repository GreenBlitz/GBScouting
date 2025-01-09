import React from "react";
import ScouterInputs from "../ScouterInputs";

interface PreGameProps {}

const PreMatch: React.FC<PreGameProps> = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-dark-text mb-6">Pre-Match</h1>
      <div className="bg-dark-card rounded-lg shadow-lg">
        {ScouterInputs.create([
          ScouterInputs.scouterName,
          ScouterInputs.qual,
          ScouterInputs.teamNumber,
          ScouterInputs.gameSide,
          ScouterInputs.startingPosition,
        ])}
      </div>
    </div>
  );
};

export default PreMatch;
