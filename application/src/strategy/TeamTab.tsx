import { useState } from "react";
import LineChart from "./charts/LineChart";
import PieChart from "./charts/PieChart";
import MapChart from "./charts/MapChart";
import {
  getMatchesByCriteria,
  FRCTeamList,
  Match,
  sortMatches,
} from "../Utils";
import { TeamData } from "../TeamData";
import React from "react";
import { renderStrategyNavBar } from "../App";

const TeamTab: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [recency, setRecency] = useState<number>(0);

  const recentMatches = sortMatches([...matches]);
  if (recency > 0 && recency < recentMatches.length) {
    recentMatches.splice(0, recentMatches.length - recency);
  }

  const teamData = new TeamData(recentMatches);

  const ampAccuracy = teamData.getAccuracy("AmpScore", "AmpMiss");
  const speakerAccuracy = teamData.getAccuracy("SpeakerScore", "SpeakerMiss");
  const passAccuracy = teamData.getAccuracy(
    "PassSuccessful",
    "PassUnSuccessful"
  );

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
              await getMatchesByCriteria(
                "Team Number",
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

      <div className="section">
        <h2>Map</h2>
        <MapChart
          imagePath={"./src/assets/Crescendo Map.png"}
          fieldObjects={teamData.getAllFieldObjects()}
        />
      </div>
      <br />

      <div className="section">
        <h2>Scoring</h2>
        <LineChart
          dataSets={{
            Speaker: {
              color: "pink",
              data: teamData.getAsLine("SpeakerScore"),
            },
            Amp: { color: "yellow", data: teamData.getAsLine("AmpScore") },
            Pass: {
              color: "purple",
              data: teamData.getAsLine("PassSuccessful"),
            },
          }}
        />
      </div>

      <div className="section">
        <h2>Miss</h2>
        <LineChart
          dataSets={{
            Speaker: {
              color: "pink",
              data: teamData.getAsLine("SpeakerMiss"),
            },
            Amp: { color: "yellow", data: teamData.getAsLine("AmpMiss") },
            Pass: {
              color: "purple",
              data: teamData.getAsLine("PassUnSuccessful"),
            },
          }}
        />
      </div>

      <div className="section">
        <h2>Auto</h2>
        <LineChart
          dataSets={{
            Score: {
              color: "green",
              data: teamData.getAsLine("SpeakerAutoScore"),
            },
            Miss: {
              color: "red",
              data: teamData.getAsLine("SpeakerAutoMiss"),
            },
          }}
        />
      </div>

      <div className="section">
        <h2>Trap</h2>
        <PieChart
          pieData={teamData.getAsPie("Trap", {
            Scored: "purple",
            Miss: "cyan",
            "Didn't Score": "yellow",
          })}
        />
      </div>

      <div className="section">
        <h2>Climb</h2>
        <PieChart
          pieData={teamData.getAsPie("Climb", {
            "Climbed Alone": "purple",
            Harmony: "cyan",
            Team: "yellow",
            Park: "orange",
            "Not On Stage": "red",
            "Harmony Three Robots": "blue",
          })}
        />
      </div>

      <div className="section">
        <h2>Amp Accuracy</h2>
        <PieChart
          pieData={{
            Score: { numberLabel: ampAccuracy, color: "green" },
            Miss: { numberLabel: 100 - ampAccuracy, color: "crimson" },
          }}
        />
      </div>

      <div className="section">
        <h2>Speaker Accuracy</h2>
        <PieChart
          pieData={{
            Score: { numberLabel: speakerAccuracy, color: "green" },
            Miss: { numberLabel: 100 - speakerAccuracy, color: "crimson" },
          }}
        />
      </div>
      <div className="section">
        <h2>Pass Accuracy</h2>
        <PieChart
          pieData={{
            Score: { numberLabel: passAccuracy, color: "green" },
            Miss: { numberLabel: 100 - passAccuracy, color: "crimson" },
          }}
        />
      </div>

      <br />

      <br />
      <div>
        <h1>Comments</h1>
        {teamData.getComments().map((comment) => (
          <h3>{comment.body + "...Qual number" + comment.qual}</h3>
        ))}
      </div>
    </div>
  );
};

export default TeamTab;
