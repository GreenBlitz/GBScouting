import { Outlet, useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import PreMatch from "./tabs/PreMatch";
import Autonomous from "./tabs/Autonomous";
import Teleoperated from "./tabs/Teleoperated";
import PostMatch from "./tabs/PostMatch";
import { renderScouterNavBar } from "../App";
import { inputFolder } from "../utils/FolderStorage";
import CancelConfirmation from "../components/CancelConfirmation";
import Inputs from "./Inputs.ts";
import ScouterInput from "./ScouterInput.tsx";
import { Match } from "../utils/Utils.ts";
import Matches from "./Matches";

const sectionNames: string[] = [
  PreMatch,
  Autonomous,
  Teleoperated,
  PostMatch,
].map((section) => section.name);

function ScouterTab() {
  const navigate = useNavigate();
  const [currentSectionNumber, setSectionNumber] = useState<number>(0);

  const navigateToSection = (section: number) => {
    setSectionNumber(section);
    navigate(sectionNames[section]);
  };

  function handleSubmit() {
    const matchValues: Record<string, any> = {};

    Object.entries(Inputs)
      .filter(([_, value]) => value instanceof ScouterInput)
      .forEach(([inputName, value]) => {
        const input = value as ScouterInput<any, any, any>;
        matchValues[inputName] = input.storage.get();
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

  return (
    <div className="scouting-tab">
      {renderScouterNavBar()}
      <h1>{sectionNames[currentSectionNumber]}</h1>
      <Outlet />
      {currentSectionNumber !== 0 && (
        <button
          type="button"
          onClick={() => navigateToSection(currentSectionNumber - 1)}
        >
          Back
        </button>
      )}
      {currentSectionNumber === sectionNames.length - 1 ? (
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
      ) : (
        <button
          type="button"
          onClick={() => navigateToSection(currentSectionNumber + 1)}
        >
          Next
        </button>
      )}
      <br /> <CancelConfirmation name="Reset" onClick={handleReset} />
    </div>
  );
}

export default ScouterTab;
