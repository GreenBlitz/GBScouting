import React from "react";
import ScouterQuery from "../ScouterQuery";
import ListQuery from "../querytypes/ListQuery";
import TextQuery from "../querytypes/TextQuery";
import { Queries } from "../../utils/FolderStorage";

interface PostMatchProps {}

const PostMatch: React.FC<PostMatchProps> = () => {
  return (
    <>
      <ListQuery
        storage={Queries.Climb}
        list={[
          "Off Stage",
          "Park",
          "Climbed Alone",
          "Harmony",
          "Harmony Three Robots",
        ]}
      />
      <ListQuery storage={Queries.Trap} list={["Didn't Score", "Scored", "Miss"]} />
      <TextQuery storage={Queries.Comment} />
    </>
  );
};

export default PostMatch;
