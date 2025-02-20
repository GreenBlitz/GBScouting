import React from "react";
import ScouterInputs from "../ScouterInputs";
import { Outlet, useNavigate } from "react-router-dom";
import { areReefsSame } from "../input-types/reef-levels/ReefLevelsInput";
import { triangleButtonMiddles } from "../input-types/ReefInput";

const ScouterAutonomous: React.FC = () => {
  return <Outlet />;
};

export const ScouterAutoPick: React.FC = () => {
  return ScouterInputs.autoReefPick.create();
};

export const ScouterAutoReef: React.FC = () => {
  const navigate = useNavigate();

  const isBlue = ScouterInputs.gameSide.getValue() === "Blue";
  const correctSide = isBlue
    ? ScouterInputs.autoReef.getValue()
    : ScouterInputs.autoReef.getOppositeSide(ScouterInputs.autoReef.getValue());

  return (
    <>
      <button
        className="bg-orange-500 w-64 h-16 text-white py-2 px-4 mb-5 rounded"
        onClick={() => navigate("../pick")}
      >
        <h1 className="text-2xl font-bold">Back</h1>
        Side{" "}
        {
          (
            triangleButtonMiddles.find((value) =>
              areReefsSame(value.reefSide, correctSide)
            ) || triangleButtonMiddles[0]
          ).name
        }
      </button>
      {ScouterInputs.autoReefLevels.create()}
    </>
  );
};

export default ScouterAutonomous;
