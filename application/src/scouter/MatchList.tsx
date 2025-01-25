import { useNavigate } from "react-router-dom";
import Collapsible from "react-collapsible";
import React from "react";
import QRCodeGenerator from "../components/QRCode-Generator";
import { renderScouterNavBar } from "../App";
import Matches from "./Matches";
import { postMatch } from "../utils/Fetches";
import { Match } from "../utils/Match";

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
      {renderScouterNavBar()}
      {matches.length === 0 && (
        <h1 className="no-matches-saved text-center text-2xl">
          No Matches Saved
        </h1>
      )}
      {matches.map((match, index) => (
        <div className="border border-gray-300 rounded p-4 mb-4">
          <Collapsible
            trigger={`Match Number ${match.qual}`}
            triggerClassName=""
            key={index}
          >
            <QRCodeGenerator data={match} />
            <br />
            <button
              className="border border-gray-500 rounded px-2 py-1 mr-2"
              type="button"
              onClick={() => removeMatch(match)}
            >
              Delete
            </button>
            <button
              className="border border-gray-500 rounded px-2 py-1"
              type="button"
              onClick={() => sendMatch(match)}
            >
              Send
            </button>
          </Collapsible>
        </div>
      ))}
    </div>
  );
};
export default MatchList;
