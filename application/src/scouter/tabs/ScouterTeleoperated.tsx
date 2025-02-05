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
      {ScouterInputs.teleopReef.create()}
      <button
        className="bg-orange-500 w-20 h-10 text-white py-2 px-4 rounded"
        onClick={() => navigate("../pick")}
      >
        Back
      </button>
    </>
  );
};

export default ScouterTeleoperated;
