import React, { useState } from "react";
import ScouterInputs from "../ScouterInputs";

const ScouterAutonomous: React.FC = () => {
  const [currentSection, setSection] = useState();
  return (
    <>
      <div className="">
        <div className="justify-center">{ScouterInputs.autoReef.create()}</div>

        <div className="space-y-4">{ScouterInputs.autoMap.create()}</div>
      </div>
    </>
  );
};

export default ScouterAutonomous;
