import { useNavigate } from "react-router-dom";
import Collapsible from "react-collapsible";
import React from "react";
import QRCodeGenerator from "../components/QRCode-Generator";
import { renderScouterNavBar } from "../App";
import Matches from "./Matches";
import { postMatch } from "../utils/Fetches";
import { Match } from "../utils/Match";
import CancelConfirmation from "../components/CancelConfirmation";

const MatchList: React.FC = () => {
  const navigate = useNavigate();

  const matches: Match[] = Matches.getAll();

  function removeMatch(match: Match) {
    Matches.remove(match);
    navigate("/scouter/matches");
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

  function sendAllMatches() {
    try {
      matches.forEach((match) => {
        postMatch(match);
        Matches.remove(match);
      });
      alert("Succesfully Sent Matches✅");
    } catch (error) {
      alert("Unable To Send Match. " + error);
    }
  }

  return (
    <div className="match-list">
      {renderScouterNavBar()}
      {matches.map((match, index) => (
        <div className="border border-gray-300 rounded p-4 mb-4">
          <Collapsible
            trigger={`Match Number ${match.qual}`}
            triggerClassName="text-xl"
            openedClassName="text-xl"
            key={index}
          >
            <div className="my-5" />
            <QRCodeGenerator data={match} />
            <br />
            <div className="rower">
              <CancelConfirmation
                onClick={() => removeMatch(match)}
                name="Remove"
                className="p-4 bg-red-600 text-xl mx-2.5"
              />
              <button
                className="p-4 bg-green-600 text-xl mx-2.5"
                onClick={() => sendMatch(match)}
              >
                Send
              </button>
            </div>
          </Collapsible>
        </div>
      ))}
      {matches.length === 0 ? (
        <h1 className="no-matches-saved text-center text-2xl">
          No Matches Saved
        </h1>
      ) : (
        <button
          className="p-4 bg-green-900 text-2xl"
          onClick={() => matches.forEach(sendMatch)}
        >
          Send All
        </button>
      )}
    </div>
  );
};
export default MatchList;
