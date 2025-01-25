import React, { useState } from "react";
import CoralButton from "./CoralButton";
import AlgaeButton from "./AlgaeButton";
import { ValuesToBePassed } from "./AutonomousMapInput";
const SushiButton: React.FC<ValuesToBePassed> = (props) => {
  return (
    <>
      <div
        className="shushiButton"
        style={{ display: "flex", flexDirection: "row", gap: "10%" }}
      >
        <CoralButton
          sushies={props.sushies}
          sushiToBeChanged={props.sushiToBeChanged}
          storage={props.storage}
        />
        <AlgaeButton
          sushies={props.sushies}
          sushiToBeChanged={props.sushiToBeChanged}
          storage={props.storage}
        />
      </div>
    </>
  );
};
export default SushiButton;
