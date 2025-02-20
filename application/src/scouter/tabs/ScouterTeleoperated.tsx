import React from "react";
import ScouterInputs from "../ScouterInputs";
import { Outlet, useNavigate } from "react-router-dom";

const ScouterTeleoperated: React.FC = () => {
  return <Outlet />;
};

export const ScouterTelePick: React.FC = () => {
  return ScouterInputs.teleReefPick.create();
};

export const ScouterTeleReef: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <button
        className="bg-orange-500 w-64 h-16 text-white py-2 px-4 mb-5 rounded"
        onClick={() => navigate("../pick")}
      >
        Back
      </button>
      {ScouterInputs.teleopReefLevels.create()}
    </>
  );
};

export default ScouterTeleoperated;
