import React from "react";
import ScouterInputs from "../Inputs";

interface PostMatchProps {}

const PostMatch: React.FC<PostMatchProps> = () => {
  return (
    <>
      {ScouterInputs.create([
        ScouterInputs.Climb,
        ScouterInputs.Trap,
        ScouterInputs.Comment,
      ])}
    </>
  );
};

export default PostMatch;
