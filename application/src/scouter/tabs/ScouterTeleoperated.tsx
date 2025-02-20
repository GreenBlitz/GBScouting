import React from "react";
import ScouterInputs from "../ScouterInputs";
import { Outlet, useNavigate } from "react-router-dom";
import { triangleButtonMiddles } from "../input-types/ReefInput";
import { areReefsSame } from "../input-types/reef-levels/ReefLevelsInput";

const ScouterTeleoperated: React.FC = () => {
  return <Outlet />;
};

export const ScouterTelePick: React.FC = () => {
  return ScouterInputs.teleReefPick.create();
};

export const ScouterTeleReef: React.FC = () => {
  const navigate = useNavigate();

  const isBlue = ScouterInputs.gameSide.getValue() === "Blue";
  const correctSide = isBlue
    ? ScouterInputs.teleopReef.getValue()
    : ScouterInputs.teleopReef.getOppositeSide(
        ScouterInputs.teleopReef.getValue()
      );

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
      {ScouterInputs.teleopReefLevels.create()}
    </>
  );
};

export default ScouterTeleoperated;
