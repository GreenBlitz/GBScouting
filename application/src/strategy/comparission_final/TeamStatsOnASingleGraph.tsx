import React, { useEffect, useState } from "react";
import { FRCTeamList, getMatchesByCriteria, Match } from "../../Utils";
import LineChart from "../charts/LineChart";
import { TeamData } from "../../TeamData";
import { Checkbox, FormLabel } from "@mui/material";

export enum independentVariable {
  speakerMissed = "Speaker Miss",
  ampMissed = "Amp Miss",
}

const TeamStatsOnASingleGraph: React.FC = () => {
  const [teamName1, updateTeamName1] = useState("");
  const [matches1, updateMatches1] = useState<Match[]>([]);

  const [teamName2, updateTeamName2] = useState("");
  const [matches2, updateMatches2] = useState<Match[]>([]);

  const teamNames = FRCTeamList;
  const handleSelect1 = async (event) => {
    updateTeamName1(event.target.value);
    updateMatches1(await getMatchesByCriteria("Team Number", teamName1));
  };
  const handleSelect2 = async (event) => {
    updateTeamName2(event.target.value);
    updateMatches2(await getMatchesByCriteria("Team Number", teamName2));
  };
  const graph = (independentVariable: independentVariable) => (
    <LineChart
      height={400}
      width={400}
      dataSets={{
        Speaker1: [
          "blue",
          new TeamData(matches1).getAsLine(independentVariable),
        ],
        Speaker2: [
          "red",
          new TeamData(matches1).getAsLine(independentVariable),
        ],
      }}
    ></LineChart>
  );
  
  const [graphes, updateGraphes] = useState<React.ReactNode[]>([]);
  const [isChecked, setChecked] = useState(false);
  const spreadGraphes = (graphArray) => [
    ...graphArray,
    graph(independentVariable.speakerMissed),
  ];
  const handleChange = () => {
    setChecked(!isChecked);
    if (isChecked) {
      updateGraphes(spreadGraphes(graphes));
    }
    if (!isChecked) {
      updateGraphes([]);
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
        value="SpekerMiss"
        checked={isChecked}
        onChange={handleChange}
      />
      {graphes}
    </>
  );
};
export default TeamStatsOnASingleGraph;
