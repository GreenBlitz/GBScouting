import { useLocation, useNavigate } from "react-router-dom";
import Collapsible from "react-collapsible";
import React, { useState } from "react";
import QRCodeGenerator from "../components/QRCode-Generator";
import { fetchData } from "../Utils";
import { renderScouterNavBar } from "../App";
import { matchFolder as matchesFolder } from "../utils/FolderStorage";

export const matchName = "Qual";

const collapsibleSize = 10;

const MatchList: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();


  const [matches, setMatches] = useState<Record<string, string>[]>(
    matchesFolder
      .keys()
      .map((matchName) => JSON.parse(matchesFolder.getItem(matchName) || "{}"))
  );

  const latestMatch: Record<string, string> | undefined = location.state;
  location.state = {};

  if (latestMatch?.[matchName]) {
    matches.push(latestMatch);
    matchesFolder.setItem(latestMatch[matchName], JSON.stringify(latestMatch));
  }

  function removeMatch(qualNumber: string, index: number) {
    matchesFolder.removeItem(qualNumber);
    const filtered = [...matches];
    filtered.splice(index, 1);
    setMatches(filtered);
    navigate("/");
  }

  function sendMatch(match: Record<string, string>, index: number) {
    fetchData("Match")
      .then(() => {
        alert("Succesfully Sent Match✅");
        removeMatch(match?.[matchName], index);
      })
      .catch(() => {
        alert("Unable To Send Match.");
      });
  }

  return (
    <div className="match-list">
      {renderScouterNavBar()}
      {matches.length === 0 && <h1>No Matches Saved</h1>}
      {matches.map((match, index) => (
        <Collapsible
          trigger={`${"ㅤ".repeat(collapsibleSize - match[matchName].length)}${
            match["Team Number"]
          } ${matchName} ${match[matchName]} ${"ㅤ".repeat(
            collapsibleSize - match[matchName].length
          )}`}
          triggerClassName={"collapsible-trigger"}
          openedClassName="collapsible-trigger"
          key={index}
        >
          <QRCodeGenerator text={JSON.stringify(match)} />
          <br />
          <button
            type="button"
            onClick={() => removeMatch(match?.[matchName], index)}
          >
            Delete
          </button>
          <button type="button" onClick={() => sendMatch(match, index)}>
            Send
          </button>
        </Collapsible>
      ))}
    </div>
  );
};
export default MatchList;
