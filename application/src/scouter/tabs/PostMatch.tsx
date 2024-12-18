import React from "react";
import Inputs from "../Inputs";

interface PostMatchProps {}

const PostMatch: React.FC<PostMatchProps> = () => {
  return <>{Inputs.create([Inputs.Climb, Inputs.Trap, Inputs.Comment])}</>;
};

export default PostMatch;
