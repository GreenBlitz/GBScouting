import React from "react";
import ScouterInputs from "../ScouterInputs";

interface PostMatchProps {}

const PostMatch: React.FC<PostMatchProps> = () => {
  return (
    <>
      {ScouterInputs.create([
        ScouterInputs.climb,
        ScouterInputs.trap,
        ScouterInputs.comment,
      ])}
    </>
  );
};

export default PostMatch;
