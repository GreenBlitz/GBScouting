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

interface TeamTabProps {}

const TeamTab: React.FC<TeamTabProps> = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [recency, setRecency] = useState<number>(0);

  const recentMatches = sortMatches([...matches]);
  if (recency > 0 && recency < recentMatches.length) {
    recentMatches.splice(0, recentMatches.length - recency);
  }

  const teamData = new TeamData(recentMatches);

  const ampAccuracy = teamData.getAccuracy("Amp Score", "Amp Miss");
  const speakerAccuracy = teamData.getAccuracy("Speaker Score", "Speaker Miss");
  const passAccuracy = teamData.getAccuracy(
    "Pass Successful",
    "Pass Unsuccessful"
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
          width={540 * 0.8}
          height={240 * 0.8}
          imagePath={"./src/assets/Crescendo Map.png"}
          dataPoints={teamData.getAllPoints()}
        />
      </div>
      <br />

      <div className="section">
        <h2>Scoring</h2>
        <LineChart
          height={300}
          width={400}
          dataSets={{
            Speaker: {
              color: "pink",
              data: teamData.getAsLine("Speaker Score"),
            },
            Amp: { color: "yellow", data: teamData.getAsLine("Amp Score") },
            Pass: {
              color: "purple",
              data: teamData.getAsLine("Pass Successful"),
            },
          }}
        />
      </div>

      <div className="section">
        <h2>Miss</h2>
        <LineChart
          height={300}
          width={400}
          dataSets={{
            Speaker: {
              color: "pink",
              data: teamData.getAsLine("Speaker Miss"),
            },
            Amp: { color: "yellow", data: teamData.getAsLine("Amp Miss") },
            Pass: {
              color: "purple",
              data: teamData.getAsLine("Pass Unsuccessful"),
            },
          }}
        />
      </div>

      <div className="section">
        <h2>Auto</h2>
        <LineChart
          height={300}
          width={400}
          dataSets={{
            Score: {
              color: "green",
              data: teamData.getAsLine("Speaker/Auto/Score"),
            },
            Miss: {
              color: "red",
              data: teamData.getAsLine("Speaker/Auto/Miss"),
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
            Score: { label: ampAccuracy, color: "green" },
            Miss: { label: 100 - ampAccuracy, color: "crimson" },
          }}
        />
      </div>

      <div className="section">
        <h2>Speaker Accuracy</h2>
        <PieChart
          pieData={{
            Score: { label: speakerAccuracy, color: "green" },
            Miss: { label: 100 - speakerAccuracy, color: "crimson" },
          }}
        />
      </div>
      <div className="section">
        <h2>Pass Accuracy</h2>
        <PieChart
          pieData={{
            Score: { label: passAccuracy, color: "green" },
            Miss: { label: 100 - passAccuracy, color: "crimson" },
          }}
        />
      </div>

      <br />

      <br />
      <div>
        <h1>Comments</h1>
        {teamData.getComments().map((comment) => (
          <h3>{comment[0] + "...Qual number" + comment[1]}</h3>
        ))}
      </div>
    </div>
  );
};

export default TeamTab;
