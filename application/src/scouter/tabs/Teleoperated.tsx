import React from "react";
import ScouterInputs from "../ScouterInputs";

const Teleoperated: React.FC = () => {
  return (
    <>
      {ScouterInputs.teleopForm.create()}
      <br />
    </>
  );
};

export default Teleoperated;
