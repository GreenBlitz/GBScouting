import React from "react";
import ScouterTab from "./ScouterTab";
import TextScouterInput from "./scouter-inputs/TextScouterInput";
import ScoutForm, { ScouterFormTypes } from "../types/ScoutForm";
import { ScouterInputElement } from "./scouter-inputs/BaseScouterInput";

const inputToElement: (input: keyof ScoutForm) => ScouterInputElement = (
  input: keyof ScoutForm
) => {
  switch (ScouterFormTypes[input]) {
    default:
      return <TextScouterInput name={input} />;
  }
};

const ScoutPage: React.FC = () => {
  return (
    <div>
      <ScouterTab>
        {inputToElement("scouterName")}
        {inputToElement("matchNumber")}
        {inputToElement("matchType")}
        {inputToElement("teamNumber")}
      </ScouterTab>
    </div>
  );
};
