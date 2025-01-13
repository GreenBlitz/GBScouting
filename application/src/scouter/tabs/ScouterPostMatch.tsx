import React from "react";
import ScouterInputs from "../ScouterInputs";

interface PostMatchProps {}

const ScouterPostMatch: React.FC<PostMatchProps> = () => {
  return (
    <>
      {ScouterInputs.create([
        ScouterInputs.climb,
        ScouterInputs.comment,
        ScouterInputs.defense,
      ])}
    </>
  );
};

export default ScouterPostMatch;
