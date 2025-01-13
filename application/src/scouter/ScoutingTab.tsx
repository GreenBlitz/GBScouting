import { Outlet, useNavigate } from "react-router-dom";
import React, { useMemo, useState } from "react";
import ScouterPreMatch from "./tabs/ScouterPreMatch.tsx";
import ScouterAutonomous from "./tabs/ScouterAutonomous.tsx";
import ScouterTeleoperated from "./tabs/ScouterTeleoperated.tsx";
import ScouterPostMatch from "./tabs/ScouterPostMatch.tsx";
import { renderScouterNavBar } from "../App";
import { inputFolder } from "../utils/FolderStorage";
import CancelConfirmation from "../components/CancelConfirmation";
import ScouterInputs from "./ScouterInputs.ts";
import ScouterInput from "./ScouterInput.tsx";
import { Match } from "../utils/Match";
import Matches from "./Matches";
import SectionHandler from "../utils/SectionHandler.ts";

const sectionNames: string[] = [
  "prematch",
  "autonomous",
  "teleoperated",
  "postmatch",
];

function ScouterTab() {
  const navigate = useNavigate();
  const sectionHandler = useMemo(() => {
    return new SectionHandler(navigate, sectionNames);
  }, []);

  function handleSubmit() {
    const matchValues: Record<string, any> = {};

    Object.entries(ScouterInputs)
      .filter(([_, value]) => value instanceof ScouterInput)
      .forEach(([inputName, value]) => {
        const input = value as ScouterInput<any, any, any>;
        matchValues[inputName] = input.getValue();
        if (!input.shouldReset()) {
          input.storage.remove();
        }
      });
    Matches.add(matchValues as Match);
    navigate("/");
  }

  function clearInputStorage() {
    inputFolder.keys().forEach((item) => inputFolder.removeItem(item));
  }

  function handleReset() {
    clearInputStorage();
    navigate("/");
  }

  const navigateToNext = () => {
    if (ScouterInputs.noShow.storage.get()) {
      handleSubmit();
    } else {
      sectionHandler.navigateNext();
    }
  };

  return (
    <div className="scouting-tab">
      {renderScouterNavBar()}
      <h1>{sectionHandler.currentRoute()}</h1>
      <Outlet />
      {!sectionHandler.isFirst() && (
        <button type="button" onClick={() => sectionHandler.navigatePrevious()}>
          Back
        </button>
      )}
      {sectionHandler.isLast() ? (
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
      ) : (
        <button type="button" onClick={navigateToNext}>
          Next
        </button>
      )}
      <br /> <CancelConfirmation name="Reset" onClick={handleReset} />
    </div>
  );
}

export default ScouterTab;
