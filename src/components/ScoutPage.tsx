import React from "react";
import ScouterTab from "./ScouterTab";
import TextScouterInput from "./scouter-inputs/TextScouterInput";

const ScoutPage: React.FC = () => {
  return (
    <div>
      <ScouterTab>
        <TextScouterInput />
      </ScouterTab>
    </div>
  );
};
