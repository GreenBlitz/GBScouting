import React from "react";
import ScouterInputs from "../ScouterInputs";
import { Outlet } from "react-router-dom";
import ScouterTeleoperated from "./ScouterTeleoperated";
import { blue } from "@mui/material/colors";

const ScouterTeleoperatedFixed: React.FC = () => {
  return <>
    <ScouterTeleoperated />
    <div className="defens" style={ {backgroundColor: "#0d1640"} }>
        {ScouterInputs.create([
            ScouterInputs.defense,
            ScouterInputs.defensiveEvasion,
          ])}
    </div>
  </>
};

export default ScouterTeleoperatedFixed;
