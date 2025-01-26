import React, { useEffect, useState } from "react";
import { FRCTeamList, getMatchesByCriteria, Match } from "../../Utils";
import LineChart from "../charts/LineChart";
import { TeamData } from "../../TeamData";
import { Checkbox, FormLabel } from "@mui/material";

export enum independentVariable {
  speakerMissed = "Speaker Miss",
  ampMissed = "Amp Miss",
}

const TeamStatsOnASingleGraphAmp: React.FC = () => {
  const [teamName1, updateTeamName1] = useState("");
  const [matches1, updateMatches1] = useState<Match[]>([]);

  const [teamName2, updateTeamName2] = useState("");
  const [matches2, updateMatches2] = useState<Match[]>([]);

  const teamNames = FRCTeamList
  const handleSelect1 = async (event) => {
    updateTeamName1(event.target.value);
    updateMatches1(await getMatchesByCriteria("Team Number", String(teamName1)));
    console.log(teamName1)
  };
  const handleSelect2 = async (event) => {
    updateTeamName2(event.target.value);
    updateMatches2(await getMatchesByCriteria("Team Number", String(teamName2)));
    console.log(teamName2)
  };
  const graph = (independentVariable: independentVariable) => (
    <LineChart
      height={400}
      width={400}
      dataSets={{
        Amp1: [
          "blue",
          new TeamData(matches1).getAsLine(independentVariable),
        ],
        Amp2: [
          "red",
          new TeamData(matches2).getAsLine(independentVariable),
        ]
      }}
    ></LineChart>
  );

  const [presentedGraph, updatePresentedGraphe] = useState(independentVariable.ampMissed)
  
  const [isChecked, setChecked] = useState(false);
  const handleChange = () => {
    setChecked(!isChecked);
    if (!isChecked) {
      updatePresentedGraphe()
    }
    if (isChecked) {

    }
  };
  
  return (
    <>
      <select id="teams1" onChange={handleSelect1}>
        {FRCTeamList.map((teamName) => (
          <option value={teamName}>{teamName}</option>
        ))}
      </select>
      <select id="teams2" onChange={handleSelect2}>
        {FRCTeamList.map((teamName) => (
          <option value={teamName}>{teamName}</option>
        ))}
      </select>
      <Checkbox
        value="AmpMiss"
        checked={isChecked}
        onChange={handleChange}
      />
      {graph(independentVariable.ampMissed)}
    </>
  );
};
export default TeamStatsOnASingleGraphAmp;

