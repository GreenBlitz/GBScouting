import React from "react";
import ScouterInputs from "../ScouterInputs";
import { Outlet, useNavigate } from "react-router-dom";

const ScouterAutonomous: React.FC = () => {
  return <Outlet />;
};

export const ScouterAutoPick: React.FC = () => {
  return ScouterInputs.autoReefPick.create();
};

export const ScouterAutoReef: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      {ScouterInputs.autoReefLevels.create()}
      <button
        className="bg-orange-500 w-64 h-16 text-white py-2 px-4 mb-5 rounded"
        onClick={() => navigate("../pick")}
      >
        Back
      </button>
    </>
  );
};

export default ScouterAutonomous;
