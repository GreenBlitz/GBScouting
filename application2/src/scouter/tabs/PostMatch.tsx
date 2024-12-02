import React from "react";
import ScouterQuery from "../ScouterQuery";

interface PostMatchProps {}

const PostMatch: React.FC<PostMatchProps> = () => {
  return (
    <>
      <ScouterQuery
        queryType="list"
        name="Climb"
        list={[
          "Off Stage",
          "Park",
          "Climbed Alone",
          "Harmony",
          "Harmony Three Robots",
        ]}
      />
      <ScouterQuery
        queryType="list"
        name="Trap"
        list={["Didn't Score", "Scored", "Miss"]}
      />
      <ScouterQuery queryType="text" name="Comment" />
    </>
  );
};

export default PostMatch;
