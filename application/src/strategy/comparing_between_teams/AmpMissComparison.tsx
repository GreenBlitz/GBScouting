import React, { useEffect, useState } from "react";
import { FRCTeamList, getMatchesByCriteria, Match } from "../../Utils";
import LineChart from "../charts/LineChart";
import { TeamData } from "../../TeamData";
import { Checkbox, FormLabel } from "@mui/material";

export enum independentVariable {
  speakerMissed = "Speaker Miss",
  ampMissed = "Amp Miss",
}

const AmpMissComparison: React.FC = () => {
    const [graphElement, setGraphElement] = useState<React.ReactNode>(null);


    const [teamName1, updateTeamName1] = useState("1577");    
    const [teamName2, updateTeamName2] = useState("1577");

    const teamNames = FRCTeamList
    const handleSelect1 = async (event) => {
        updateTeamName1(event.target.value.slice(0, event.target.value.indexOf(`\t`)));
    };
    const handleSelect2 = async (event) => {
        updateTeamName2(event.target.value.slice(0, event.target.value.indexOf(`\t`)));
    };

    useEffect(() => {
        const fetchData = async () => {
        const matches1 = await getMatchesByCriteria("Team Number", teamName1);
        const teamData1 = new TeamData(matches1);
        const chartData1 = teamData1.getAsLine(independentVariable.ampMissed);

        const matches2 = await getMatchesByCriteria("Team Number", teamName2);
        const teamData2 = new TeamData(matches2);
        const chartData2 = teamData2.getAsLine(independentVariable.ampMissed);


        setGraphElement(
            <>
                <div className="teamComparison">
                <LineChart
                    height={150}
                    width={400}
                    dataSets={{
                        Speaker1: ["blue", chartData1],
                    }} /><LineChart
                        height={150}
                        width={400}
                        dataSets={{
                            Speaker2: ["red", chartData2],
                        }} />
                </div>
            </>
        );
        };

        fetchData();
    }, [teamName1, teamName2]);

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
        {graphElement}
        </>
    );
    };

    export default AmpMissComparison;
