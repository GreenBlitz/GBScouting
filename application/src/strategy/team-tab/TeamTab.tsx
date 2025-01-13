import { useState } from "react";
import { Match, matchFieldNames as matchFields } from "../../utils/Match";
import { FRCTeamList, sortMatches } from "../../utils/Utils";
import { TeamData } from "../../TeamData";
import React from "react";
import { renderStrategyNavBar } from "../../App";
import { fetchMatchesByCriteria } from "../../utils/Fetches";
import { Link, Outlet } from "react-router-dom";

const TeamTab: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [recency, setRecency] = useState<number>(0);

  const recentMatches = sortMatches([...matches]);
  if (recency > 0 && recency < recentMatches.length) {
    recentMatches.splice(0, recentMatches.length - recency);
  }

  const teamData = new TeamData(recentMatches);

  return (
    <div className="strategy-app">
      {renderStrategyNavBar()}
      <br />
      <br />
      <div className="team-picker">
        <label htmlFor="team number">Team Number</label>

        <select
          id="team number"
          name="team number"
          onChange={async (event) =>
            setMatches(
              await fetchMatchesByCriteria(
                matchFields.teamNumber,
                event.target.value.slice(0, 4) || "0"
              )
            )
          }
        >
          {FRCTeamList.map((item, index) => (
            <option value={item} key={index}>
              {item}
            </option>
          ))}
        </select>
        <label htmlFor="recency">Filter By Recency</label>
        <input
          type="number"
          id="recency"
          name="recency"
          onChange={(event) => setRecency(parseInt(event.target.value))}
          min={1}
          max={matches.length}
          defaultValue={matches.length}
        />
      </div>
      <br />
      <nav className="nav-bar">
        <ul>
          <li>
            <Link to="/team/autonomous" state={teamData}>
              Autonomous
            </Link>
          </li>
          <li>
            <Link to="/team/teleoperated" state={teamData}>
              Teleoperated
            </Link>
          </li>
          <li>
            <Link to="/team/endgame" state={teamData}>
              Endgame
            </Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default TeamTab;
