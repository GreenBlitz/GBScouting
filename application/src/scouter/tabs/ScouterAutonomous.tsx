import React from "react";
import ScouterInputs from "../ScouterInputs";

const ScouterAutonomous: React.FC = () => {
  return (
    <>
      <div className="">
        <div className="space-y-4">
          {ScouterInputs.autoCollect.create()}
          {ScouterInputs.autoMap.create()}
        </div>
        <div className="justify-center">{ScouterInputs.autoReef.create()}</div>
      </div>
    </>
  );
};

export default ScouterAutonomous;
