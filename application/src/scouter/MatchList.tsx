import { useNavigate } from "react-router-dom";
import Collapsible from "react-collapsible";
import React from "react";
import QRCodeGenerator from "../components/QRCode-Generator";
import { fetchData, Match } from "../Utils";
import { renderScouterNavBar } from "../App";
import {} from "module";
import Matches from "./Matches";

const MatchList: React.FC = () => {

  const matches = Matches.getAll();
  console.log(matches);

  function sendMatch(match: Match) {
    fetchData("Match")
      .then(() => {
        alert("Succesfully Sent Match✅");
        Matches.remove(match);
      })
      .catch(() => {
        console.log(match);
        alert("Unable To Send Match.");
      });
  }

  return (
    <div className="match-list">
      {renderScouterNavBar()}
      {matches.length === 0 && <h1>No Matches Saved</h1>}
      {matches.map((match, index) => (
        <Collapsible
          trigger={`Match Number ${match.Qual}`}
          triggerClassName="collapsible-trigger"
          openedClassName="collapsible-trigger"
          key={index}
        >
          <QRCodeGenerator text={JSON.stringify(match)} />
          <br />
          <button type="button" onClick={() => Matches.remove(match)}>
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
