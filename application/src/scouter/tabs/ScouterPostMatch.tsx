import React from "react";
import ScouterInputs from "../ScouterInputs";

const ScouterPostMatch: React.FC = () => {
  return (
    <>
      {ScouterInputs.create([
        ScouterInputs.climb,
        ScouterInputs.comment,
        ScouterInputs.endgameCollection,
      ])}
    </>
  );
};

export default ScouterPostMatch;
