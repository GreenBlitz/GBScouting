import React from "react";
import ScouterInputs from "../ScouterInputs";

const ScouterPostMatch: React.FC = () => {
  return (
    <>
      {ScouterInputs.create([
        ScouterInputs.climb,
        ScouterInputs.comment,
        ScouterInputs.defense,
        ScouterInputs.defenseHurt,
      ])}
    </>
  );
};

export default ScouterPostMatch;
