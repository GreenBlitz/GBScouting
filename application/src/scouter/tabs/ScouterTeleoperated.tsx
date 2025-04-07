import React from "react";
import ScouterInputs from "../ScouterInputs";
import { Outlet } from "react-router-dom";
import ScouterPartialTeleoperated from "./ScouterPartialTeleoperated";
import { blue } from "@mui/material/colors";

const ScouterTeleoperated: React.FC = () => {
  return <>
    <ScouterPartialTeleoperated />
    <div className="defens" style={ {backgroundColor: "#263163"} }>
        {ScouterInputs.create([
            ScouterInputs.defense,
            ScouterInputs.defensiveEvasion,
          ])}
    </div>
  </>
};

export default ScouterTeleoperated;
