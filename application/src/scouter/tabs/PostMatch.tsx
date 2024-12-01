import React from "react";
import ScouterQuery from "../ScouterQuery";
import ListQuery from "../querytypes/ListQuery";
import TextQuery from "../querytypes/TextQuery";

interface PostMatchProps {}

const PostMatch: React.FC<PostMatchProps> = () => {
  return (
    <>
      <ListQuery
        name="Climb"
        list={[
          "Off Stage",
          "Park",
          "Climbed Alone",
          "Harmony",
          "Harmony Three Robots",
        ]}
      />
      <ListQuery
        name="Trap"
        list={["Didn't Score", "Scored", "Miss"]}
      />
      <TextQuery name="Comment" />
    </>
  );
};

export default PostMatch;
