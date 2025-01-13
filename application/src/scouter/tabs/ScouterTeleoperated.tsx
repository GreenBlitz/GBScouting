import React from "react";
import ScouterInputs from "../ScouterInputs";
import ReefForm from "../../components/ReefForm";

interface TeleoperatedProps {}

const ScouterTeleoperated: React.FC<TeleoperatedProps> = () => {
  return ScouterInputs.reefForm.create();
};

export default ScouterTeleoperated;
