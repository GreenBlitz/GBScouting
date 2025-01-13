import { useNavigate } from "react-router-dom";
import Collapsible from "react-collapsible";
import React from "react";
import QRCodeGenerator from "../components/QRCode-Generator";
import Matches from "./Matches";
import { postMatch } from "../utils/Fetches";
import { Match } from "../utils/Match";
import { scouterTabs } from "../utils/Tabs";

const MatchList: React.FC = () => {
  const navigate = useNavigate();

  const matches: Match[] = Matches.getAll();

  function removeMatch(match: Match) {
    Matches.remove(match);
    navigate("/");
  }

  function sendMatch(match: Match) {
    postMatch(match)
      .then(() => {
        alert("Succesfully Sent Match✅");
        removeMatch(match);
      })
      .catch(() => {
        console.log(match);
        alert("Unable To Send Match.");
      });
  }

  return (
    <div className="match-list">
      {scouterTabs.renderNavBar()}
      {matches.length === 0 && <h1>No Matches Saved</h1>}
      {matches.map((match, index) => (
        <Collapsible
          trigger={`Match Number ${match.qual}`}
          triggerClassName="collapsible-trigger"
          openedClassName="collapsible-trigger"
          key={index}
        >
          <QRCodeGenerator data={match} />
          <br />
          <button type="button" onClick={() => removeMatch(match)}>
            Delete
          </button>
          <button type="button" onClick={() => sendMatch(match)}>
            Send
          </button>
        </Collapsible>
      ))}
    </div>
  );
};
export default MatchList;
