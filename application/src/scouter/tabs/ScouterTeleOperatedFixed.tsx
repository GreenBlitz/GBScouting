import React from "react";
import ScouterInputs from "../ScouterInputs";
import { Outlet } from "react-router-dom";
import ScouterTeleoperated from "./ScouterTeleoperated";

const ScouterTeleoperatedFixed: React.FC = () => {
  return <>
    <ScouterTeleoperated />
    {ScouterInputs.create([
            ScouterInputs.defense,
            ScouterInputs.defensiveEvasion,
          ])}
  </>
};

export default ScouterTeleoperatedFixed;
