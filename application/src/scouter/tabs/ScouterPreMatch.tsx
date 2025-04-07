import React from "react";
import ScouterInputs from "../ScouterInputs";

const ScouterPreMatch: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-6" style={{display: "flex", flexDirection:"column"}}>
      {ScouterInputs.create([
        ScouterInputs.scouterName,
        ScouterInputs.teamNumber,
        ScouterInputs.noShow,
      ])}
    </div>
  );
};

export default ScouterPreMatch;
