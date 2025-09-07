import React from "react";
import ScouterInputs from "../ScouterInputs";
import { Outlet } from "react-router-dom";
import ScouterPartialTeleoperated from "./ScouterPartialTeleoperated";
import { blue } from "@mui/material/colors";

const ScouterTeleoperated: React.FC = () => {
  return <>
    <ScouterPartialTeleoperated />
  </>
};

export default ScouterTeleoperated;
