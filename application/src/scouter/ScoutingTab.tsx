import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import PreMatch from "./tabs/PreMatch";
import Autonomous from "./tabs/Autonomous";
import Teleoperated from "./tabs/Teleoperated";
import PostMatch from "./tabs/PostMatch";
import { renderScouterNavBar } from "../App";
import { queryFolder } from "../utils/FolderStorage";
import CancelCheck from "../components/CancelCheck";
import Queries from "./Queries";
import ScouterQuery from "./ScouterQuery";
import { Match } from "../Utils";
import Matches from "./Matches";

const sections: React.FC[] = [PreMatch, Autonomous, Teleoperated, PostMatch];

const constantValues = ["Scouter Name", "Game Side"];

function ScouterTab() {
  const navigate = useNavigate();
  const [currentSectionNumber, setSectionNumber] = useState<number>(0);

  function handleSubmit() {

    const matchValues: Record<string,any> = {};

    Object.entries(Queries).filter(
      ([_, value]) => value instanceof ScouterQuery
    ).forEach(([queryName, value]) => {
      const query = value as ScouterQuery<any,any,any>;
      matchValues[queryName] = query.storage.get();
      if (!constantValues.includes(queryName)) {
        query.storage.remove();
      }
    });

    matchValues["MapPoints"] = queryFolder.getItem("MapPoints"); //temporary
    queryFolder.removeItem("MapPoints")

    Matches.add(matchValues as Match);
    navigate("/");
  }

  function clearQueryStorage() {
    queryFolder.keys().forEach((item) => queryFolder.removeItem(item));
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
