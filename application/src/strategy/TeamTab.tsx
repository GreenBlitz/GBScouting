import { useState } from "react";
import LineChart from "./charts/LineChart";
import PieChart from "./charts/PieChart";
import { Match, matchFieldNames as matchFields } from "../utils/Match";
import { FRCTeamList, sortMatches } from "../utils/Utils";
import { TeamData } from "../TeamData";
import React from "react";
import { fetchMatchesByCriteria } from "../utils/Fetches";
import { stratgyTabs } from "../utils/Tabs";

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
      {stratgyTabs.renderNavBar()}
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

  
      <div className="section">
        <h2>Climb</h2>
        <PieChart
          pieData={teamData.getAsPie(matchFields.climb, {
            "Climbed Alone": "purple",
            Harmony: "cyan",
            Team: "yellow",
            Park: "orange",
            "Not On Stage": "red",
            "Harmony Three Robots": "blue",
          })}
        />
      </div>

      <br />

      <br />
      <div>
        <h1>Comments</h1>
        {teamData.getComments().map((comment) => (
          <h3>{"Qual #" + comment.qual + ": " + comment.body}</h3>
        ))}
      </div>
    </div>
  );
};

export default TeamTab;
