import { useState } from "react";
import { Match, matchFieldNames as matchFields } from "../../utils/Match";
import { FRCTeamList, sortMatches } from "../../utils/Utils";
import { TeamData } from "../../TeamData";
import React from "react";
import { renderStrategyNavBar } from "../../App";
import { fetchMatchesByCriteria } from "../../utils/Fetches";
import { Link, Outlet } from "react-router-dom";

const exampleData: TeamData = new TeamData([
  {
    scouterName: "",
    qual: 0,
    teamNumber: 0,
    gameSide: "",
    startingPosition: "",
    noShow: false,
    defense: undefined,
    defenseHurt: undefined,
    climb: "",
    comment: "",
    teleopReef: {
      L1: { score: 1, miss: 1 },
      L2: { score: 2, miss: 0 },
      L3: { score: 2, miss: 0 },
      L4: { score: 3, miss: 0 },
      net: { score: 0, miss: 0 },
      proccessor: 0,
    },
    autoMap: {
      Sushi1: { coral: false, algea: false },
      Sushi2: { coral: false, algea: false },
      Sushi3: { coral: false, algea: false },
    },
    autoCollect: 0,
    autoReef: {
      L1: { score: 0, miss: 0 },
      L2: { score: 0, miss: 0 },
      L3: { score: 0, miss: 0 },
      L4: { score: 0, miss: 0 },
      net: { score: 0, miss: 0 },
      proccessor: 0,
    },
  },
  {
    scouterName: "",
    qual: 2,
    teamNumber: 0,
    gameSide: "",
    startingPosition: "",
    noShow: false,
    defense: undefined,
    defenseHurt: undefined,
    climb: "",
    comment: "",
    teleopReef: {
      L1: { score: 0, miss: 0 },
      L2: { score: 0, miss: 0 },
      L3: { score: 0, miss: 0 },
      L4: { score: 0, miss: 0 },
      net: { score: 0, miss: 0 },
      proccessor: 0,
    },
    autoMap: {
      Sushi1: { coral: false, algea: false },
      Sushi2: { coral: false, algea: false },
      Sushi3: { coral: false, algea: false },
    },
    autoCollect: 0,
    autoReef: {
      L1: { score: 0, miss: 0 },
      L2: { score: 0, miss: 0 },
      L3: { score: 0, miss: 0 },
      L4: { score: 0, miss: 0 },
      net: { score: 0, miss: 0 },
      proccessor: 0,
    },
  },
]);

const TeamTab: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [recency, setRecency] = useState<number>(5);

  const recentMatches = sortMatches([...matches]);
  if (recency > 0 && recency < recentMatches.length) {
    recentMatches.splice(0, recentMatches.length - recency);
  }

  // const teamData = new TeamData(recentMatches);
  const teamData = exampleData;
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
          defaultValue={recency}
        />
      </div>
      <br />
      <nav className="nav-bar">
        <ul>
          <li>
            <Link to="/team/autonomous">Autonomous</Link>
          </li>
          <li>
            <Link to="/team/teleoperated">Teleoperated</Link>
          </li>
          <li>
            <Link to="/team/endgame">Endgame</Link>
          </li>
        </ul>
      </nav>
      <Outlet context={{ teamData }} />
    </div>
  );
};

export default TeamTab;
