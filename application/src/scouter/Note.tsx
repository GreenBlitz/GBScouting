import React, { useState, useEffect } from "react";
import { renderScouterNavBar } from "../App";

const Note: React.FC = () => {
  const allTeams: Record<number, string[]> = {
    1: ["Team 1", "Team 2", "Team 3", "Team 4", "Team 5", "Team 6"],
    2: ["Team 7", "Team 8", "Team 9", "Team 10", "Team 11", "Team 12"],
    3: ["Team 13", "Team 14", "Team 15", "Team 16", "Team 17", "Team 18"],
    4: ["Team 19", "Team 20", "Team 21", "Team 22", "Team 23", "Team 24"],
    5: ["Team 25", "Team 26", "Team 27", "Team 28", "Team 29", "Team 30"],
    6: ["Team 31", "Team 32", "Team 33", "Team 34", "Team 35", "Team 36"],
    7: ["Team 37", "Team 38", "Team 39", "Team 40", "Team 41", "Team 42"],
    8: ["Team 43", "Team 44", "Team 45", "Team 46", "Team 47", "Team 48"],
    9: ["Team 49", "Team 50", "Team 51", "Team 52", "Team 53", "Team 54"],
  };

  const [teamsCount, setTeamsCount] = useState<number>(1);
  const [teamsData, setTeamsData] = useState<Record<string, string>>(() => {
    const savedData = localStorage.getItem("teamsData");
    return savedData ? JSON.parse(savedData) : {};
  });

  useEffect(() => {
    localStorage.setItem("teamsData", JSON.stringify(teamsData));
  }, [teamsData]);

  const handleTeamsCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Math.min(9, parseInt(event.target.value) || 1));
    setTeamsCount(value);
  };

  const handleClear = () => {
    setTeamsData({});
    localStorage.removeItem("teamsData");
  };

  const handleSave = () => {
    localStorage.setItem("teamsData", JSON.stringify(teamsData));
  };

  const displayedTeams = Object.values(allTeams)
    .flat()
    .slice((teamsCount - 1) * 6, teamsCount * 6);

  return (
    <div>
        {renderScouterNavBar()}
      <h1>Teams Note</h1>
      <div>
        <label>
          Number of quals (1-9):
          <input
            type="number"
            value={teamsCount}
            onChange={handleTeamsCountChange}
            min="1"
            max="12"
          />
        </label>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
      {displayedTeams.map((team) => (
        <div key={team} style={{ marginRight: "20px", marginBottom: "20px" }}>
             <h3>{team}</h3>
        <textarea
         value={teamsData[team] || ""}
          onChange={(e) => setTeamsData({ ...teamsData, [team]: e.target.value })}
         />
        </div>
))}

      </div>

      <div style={{ marginTop: "20px" }}>
     <button onClick={handleClear} style={{ marginRight: "10px" }}>
          Clear All
        </button> 
        <button onClick={handleSave} style={{ marginRight: "10px" }}>
          Save
        </button>  
      </div>
    </div>
  );
};

export default Note;
