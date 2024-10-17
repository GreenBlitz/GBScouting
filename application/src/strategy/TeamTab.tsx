import { useState } from "react";
import LineChart from "./charts/LineChart";
import PieChart from "./charts/PieChart";
import MapChart, { DataPoint, PassingPoint } from "./charts/MapChart";
import { getMatchesByCriteria, FRCTeamList, Match, sortMatches } from "../Utils";
import { TeamData } from "../TeamData";
import React from "react";
import { renderStrategyNavBar } from "../App";

interface TeamTabProps {}


function getAllPoints(matches: Match[]) {
  let points: (DataPoint | PassingPoint)[] = [];
  matches.forEach((match) => {
    const mapPoints: (DataPoint | PassingPoint)[] = JSON.parse(
      match[TeamData.mapName + "/Points"]
    );
    points = [...points, ...mapPoints];
  });
  return points;
}

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
      <div className="section">
        <h2>Scoring</h2>
        <LineChart
          height={300}
          width={400}
          dataSets={{
            Speaker: ["pink", teamData.getAsLine("Speaker Score")],
            Amp: ["yellow", teamData.getAsLine("Amp Score")],
            Pass: ["purple", teamData.getAsLine("Pass Successful")],
          }}
        />
      </div>

      <div className="section">
        <h2>Miss</h2>
        <LineChart
          height={300}
          width={400}
          dataSets={{
            Speaker: ["pink", teamData.getAsLine("Speaker Miss")],
            Amp: ["yellow", teamData.getAsLine("Amp Miss")],
            Pass: ["purple", teamData.getAsLine("Pass Unsuccessful")],
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
            Score: [ampAccuracy, "green"],
            Miss: [100 - ampAccuracy, "crimson"],
          }}
        />
      </div>

      <div className="section">
        <h2>Speaker Accuracy</h2>
        <PieChart
          pieData={{
            Score: [speakerAccuracy, "green"],
            Miss: [100 - speakerAccuracy, "crimson"],
          }}
        />
      </div>
      <div className="section">
        <h2>Pass Accuracy</h2>
        <PieChart
          pieData={{
            Score: [passAccuracy, "green"],
            Miss: [100 - passAccuracy, "crimson"],
          }}
        />
      </div>

      <div className="section">
        <h2>Map</h2>
        <MapChart
          width={540 * 0.8}
          height={240 * 0.8}
          imagePath={"./src/assets/Crescendo Map.png"}
          dataPoints={getAllPoints(recentMatches)}
        />
      </div>

      <br />
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
  );
};

export default TeamTab;
