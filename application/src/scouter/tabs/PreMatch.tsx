import React from "react";
import TextQuery from "../querytypes/TextQuery";
import NumberQuery from "../querytypes/NumberQuery";
import ListQuery from "../querytypes/ListQuery";

interface PreGameProps {}

const PreMatch: React.FC<PreGameProps> = () => {
  return (
    <>
      <TextQuery name="Scouter Name" />
      <NumberQuery name="Qual" />
      <NumberQuery name="Team Number" />
      <ListQuery name="Game Side" list={["Blue", "Red"]} />
      <ListQuery
        name={"Starting Position"}
        list={["Amp Side", "Middle", "Source Side", "No Show"]}
      />
    </>
  );
};

export default PreMatch;
