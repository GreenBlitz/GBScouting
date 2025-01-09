import { useState } from "react";
import LineChart from "./charts/LineChart";
import PieChart from "./charts/PieChart";
import MapChart from "./charts/MapChart";
import { Match, matchFieldNames as matchFields } from "../utils/Match";
import { FRCTeamList, sortMatches } from "../utils/Utils";
import { TeamData } from "../TeamData";
import React from "react";
import { renderStrategyNavBar } from "../App";
import { fetchMatchesByCriteria } from "../utils/Fetches";
import LinearHistogramChart from "./charts/LinearHistogramChart";

const TeamTab: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [recency, setRecency] = useState<number>(0);

  const recentMatches = sortMatches([...matches]);
  if (recency > 0 && recency < recentMatches.length) {
    recentMatches.splice(0, recentMatches.length - recency);
  }

  const teamData = new TeamData(recentMatches);

  const ampAccuracy = teamData.getAccuracy(
    matchFields.ampScore,
    matchFields.ampMiss
  );
  const speakerAccuracy = teamData.getAccuracy(
    matchFields.speakerScore,
    matchFields.speakerMiss
  );
  const passAccuracy = teamData.getAccuracy(
    matchFields.successfulPass,
    matchFields.failPass
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

      <div className="section">
        <h2>Map</h2>
        <MapChart
          imagePath={"./src/assets/crescendo-map.png"}
          fieldObjects={teamData.getAllFieldObjects()}
        />
      </div>
      <br />

      <LinearHistogramChart
        height={40}
        width={400}
        sectionColors={{
          Park: "blue",
          "Off Barge": "red",
          "Shallow Cage": "yellow",
          "Deep Cage": "green",
        }}
        sections={[
          { value: 1, sectionName: "Park" },
          { value: 3, sectionName: "Shallow Cage" },
          { value: 2, sectionName: "Park" },
          { value: 1, sectionName: "Deep Cage" },
          { value: 2, sectionName: "Shallow Cage" },
          { value: 1, sectionName: "Park" },
          { value: 1, sectionName: "Off Barge" },
        ]}
      />
  
      <div className="section">
        <h2>Scoring</h2>
        <LineChart
          dataSets={{
            Speaker: {
              color: "pink",
              data: teamData.getAsLine(matchFields.speakerScore),
            },
            Amp: {
              color: "yellow",
              data: teamData.getAsLine(matchFields.ampScore),
            },
            Pass: {
              color: "purple",
              data: teamData.getAsLine(matchFields.successfulPass),
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
              data: teamData.getAsLine(matchFields.speakerMiss),
            },
            Amp: {
              color: "yellow",
              data: teamData.getAsLine(matchFields.ampMiss),
            },
            Pass: {
              color: "purple",
              data: teamData.getAsLine(matchFields.failPass),
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
              data: teamData.getAsLine(matchFields.speakerAutoScore),
            },
            Miss: {
              color: "red",
              data: teamData.getAsLine(matchFields.speakerAutoMiss),
            },
          }}
        />
      </div>

      <div className="section">
        <h2>Trap</h2>
        <PieChart
          pieData={teamData.getAsPie(matchFields.trap, {
            Scored: "purple",
            Miss: "cyan",
            "Didn't Score": "yellow",
          })}
        />
      </div>

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

      <div className="section">
        <h2>Amp Accuracy</h2>
        <PieChart
          pieData={{
            Score: { percentage: ampAccuracy.value, color: "green" },
            Miss: { percentage: ampAccuracy.complement, color: "crimson" },
          }}
        />
      </div>

      <div className="section">
        <h2>Speaker Accuracy</h2>
        <PieChart
          pieData={{
            Score: { percentage: speakerAccuracy.value, color: "green" },
            Miss: { percentage: speakerAccuracy.complement, color: "crimson" },
          }}
        />
      </div>
      <div className="section">
        <h2>Pass Accuracy</h2>
        <PieChart
          pieData={{
            Score: { percentage: passAccuracy.value, color: "green" },
            Miss: { percentage: passAccuracy.complement, color: "crimson" },
          }}
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
