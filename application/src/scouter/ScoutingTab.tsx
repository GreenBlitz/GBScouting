import ScouterQuery, { localStorageTabName } from "./ScouterQuery";
import { useNavigate } from "react-router-dom";
import MapQuery from "./querytypes/MapQuery";
import { matchName } from "./MatchList";
import React, { useState } from "react";
import PreMatch from "./tabs/PreMatch";
import Autonomous from "./tabs/Autonomous";
import Teleoperated from "./tabs/Teleoperated";
import PostMatch from "./tabs/PostMatch";

const sections: React.FC[] = [PreMatch, Autonomous, Teleoperated, PostMatch];

function ScouterTab() {
  const navigate = useNavigate();
  const [currentSectionNumber, setSectionNumber] = useState<number>(0);

  const [areYouSure, setAreYouSure] = useState<boolean>(false);

  function handleSubmit() {
    const formValues: Record<string, string> = {};
    Object.keys(localStorage)
      .filter((item) => item.startsWith(localStorageTabName))
      .forEach((item) => {
        formValues[item.slice(localStorageTabName.length)] =
          localStorage.getItem(item) + "";
        localStorage.removeItem(item);
      });
    navigate("/", { state: formValues });
  }

  function clearQueryStorage() {
    Object.keys(localStorage)
      .filter((item) => item.startsWith(localStorageTabName))
      .forEach((item) => localStorage.removeItem(item));
  }

  function handleReset() {
    clearQueryStorage();
    window.location.reload();
  }

  return (
    <div className="scouting-tab">
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
      <br />

      {areYouSure ? (
        <>
          <h2>Are You Sure?</h2>
          <button type="button" onClick={handleReset}>
            Yes
          </button>
          <button type="button" onClick={() => setAreYouSure(false)}>
            No
          </button>
        </>
      ) : (
        <>
          <br />
          <br />
          <br />
          <button type="button" onClick={() => setAreYouSure(true)}>
            Reset
          </button>
        </>
      )}
    </div>
  );
}

export default ScouterTab;