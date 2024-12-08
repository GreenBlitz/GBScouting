import React from "react";
import TextQuery from "../querytypes/TextQuery";
import NumberQuery from "../querytypes/NumberQuery";
import ListQuery from "../querytypes/ListQuery";
import { Queries } from "../../utils/FolderStorage";

interface PreGameProps {}

const PreMatch: React.FC<PreGameProps> = () => {
  return (
    <>
      <TextQuery storage={Queries.ScouterName} />
      <NumberQuery storage={Queries.Qual} />
      <NumberQuery storage={Queries.TeamNumber} />
      <ListQuery storage={Queries.GameSide} list={["Blue", "Red"]} />
      <ListQuery
        storage={Queries.StartingPosition}
        list={["Amp Side", "Middle", "Source Side", "No Show"]}
      />
    </>
  );
};

export default PreMatch;
