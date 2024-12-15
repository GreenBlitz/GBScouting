import React from "react";
import Queries from "../Queries";

interface PreGameProps {}

const PreMatch: React.FC<PreGameProps> = () => {
  return (
    <>
      {Queries.instantiate([
        Queries.ScouterName,
        Queries.Qual,
        Queries.TeamNumber,
        Queries.GameSide,
        Queries.StartingPosition,
      ])}
    </>
  );
};

export default PreMatch;
