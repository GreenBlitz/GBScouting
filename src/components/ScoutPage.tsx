import React from "react";
import ScouterTab from "./ScouterTab";
import TextScouterInput from "./scouter-inputs/TextScouterInput";
import NumberScouterInput from "./scouter-inputs/NumberScouterInput";
import DropdownScouterInput from "./scouter-inputs/DropdownScouterInput";


const ScoutPage: React.FC = () => {
  return (
    <div>
      <ScouterTab>
        <TextScouterInput name="scouterName" />
        <NumberScouterInput name="matchNumber" defaultValue={0} />
        <DropdownScouterInput name={""} dropdownOptions={["hi","hello"]}  />
      </ScouterTab>
    </div>
  );
};
