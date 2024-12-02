import React from "react";
import ScouterQuery from "../ScouterQuery";

interface PreGameProps {}

const PreMatch: React.FC<PreGameProps> = () => {
  return (
    <>
      <ScouterQuery queryType="text" name="Scouter Name" />
      <ScouterQuery queryType="number" name="Qual" />
      <ScouterQuery queryType="number" name="Team Number" />
      <ScouterQuery queryType="list" name="Game Side" list={["Blue", "Red"]} />
      <ScouterQuery
        queryType="list"
        name={"Starting Position"}
        list={["Amp Side", "Middle", "Source Side", "No Show"]}
      />
    </>
  );
};

export default PreMatch;
