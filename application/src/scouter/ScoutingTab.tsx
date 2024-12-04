import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import PreMatch from "./tabs/PreMatch";
import Autonomous from "./tabs/Autonomous";
import Teleoperated from "./tabs/Teleoperated";
import PostMatch from "./tabs/PostMatch";
import { renderScouterNavBar } from "../App";
import { queryFolder } from "../utils/FolderStorage";
import CancelCheck from "../components/CancelCheck";

const sections: React.FC[] = [PreMatch, Autonomous, Teleoperated, PostMatch];


const constantValues = ["Scouter Name", "Game Side"]

function ScouterTab() {
  const navigate = useNavigate();
  const [currentSectionNumber, setSectionNumber] = useState<number>(0);

  function handleSubmit() {
    const formValues: Record<string, string> = {};
    queryFolder.keys().forEach((item) => {
        formValues[item] =
          queryFolder.getItem(item) + "";
        if (!constantValues.includes(item)) {
          queryFolder.removeItem(item);
        }
      });

    navigate("/", { state: formValues });
  }

  function clearQueryStorage() {
    queryFolder.keys()
      .forEach((item) => queryFolder.removeItem(item));
  }

  function handleReset() {
    clearQueryStorage();
    navigate("/");
  }

  return (
    <div className="scouting-tab">
      {renderScouterNavBar()}
      <h1>{sections[currentSectionNumber].name}</h1>
      {sections[currentSectionNumber].apply({})}
      {currentSectionNumber !== 0 && (
        <button
          type="button"
          onClick={() => setSectionNumber(currentSectionNumber - 1)}
        >
          Back
        </button>
      )}
      {currentSectionNumber === sections.length - 1 ? (
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setSectionNumber(currentSectionNumber + 1)}
        >
          Next
        </button>
      )}
      <br /> <CancelCheck name="Reset" onClick={handleReset} />
    </div>
  );
}

export default ScouterTab;
