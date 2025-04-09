import React from "react";
import { ScouterInputElement } from "./scouter-inputs/BaseScouterInput";

interface ScouterTabProps {
  children: ScouterInputElement | ScouterInputElement[];
}

const ScouterTab: React.FC<ScouterTabProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default ScouterTab;
