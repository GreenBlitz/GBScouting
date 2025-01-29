import React, { useState } from "react";
import ScouterInputs from "../ScouterInputs";

const sections = ["Pick", "Score", "Collect"];
const ScouterAutonomous: React.FC = () => {
  const [currentSection, setSection] = useState(sections[0]) ;
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
