import React from "react";
import { Outlet } from "react-router-dom";
import ScouterInputs from "../../ScouterInputs";

const ScouterAutonomous: React.FC = () => {
  return (
    <>
      <div className="w-96 flex flex-row">
        <h2
          className="text-2xl"
          style={{ fontFamily: "Franklin Gothic Black" }}
        >
          AUTO
        </h2>
        <div className="w-40" />
        <h3
          className="text-2xl text-yellow-300"
          style={{ fontFamily: "Franklin Gothic Black" }}
        >
          {ScouterInputs.teamNumber.getValue()}
        </h3>
      </div>
      <Outlet />
    </>
  );
};

export default ScouterAutonomous;
