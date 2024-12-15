import React from "react";
import Queries from "../Queries";

interface PostMatchProps {}

const PostMatch: React.FC<PostMatchProps> = () => {
  return <>{Queries.render([Queries.Climb, Queries.Trap, Queries.Comment])}</>;
};

export default PostMatch;
