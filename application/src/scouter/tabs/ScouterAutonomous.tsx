import React from "react";
import ScouterInputs from "../ScouterInputs";

const ScouterAutonomous: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          {ScouterInputs.autoCollect.create()}
          {ScouterInputs.autoMap.create()}
        </div>
        <div className="flex items-center justify-center">
          {ScouterInputs.autoReef.create()}
        </div>
      </div>
    </>
  );
};

export default ScouterAutonomous;
