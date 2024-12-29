import React, { useEffect, useState } from "react";
import { FRCTeamList, getMatchesByCriteria, Match } from "../../Utils";
import LineChart from "../charts/LineChart";
import { TeamData } from "../../TeamData";
import { Checkbox, FormLabel } from "@mui/material";

export enum independentVariable{
    speakerMissed = "Speaker Miss",
    ampMissed = "Amp Miss"
}

const TeamStats: React.FC = ()=>{
    const [teamName, updateTeamName] = useState('');
    const [matches, updateMatches] = useState<Match[]>([])
    const teamNames = FRCTeamList
    const handleSelect =  async (event)=>{
        updateTeamName(event.target.value)
        updateMatches(await getMatchesByCriteria("Team Number", teamName))
    }
    const graph = (independentVariable: independentVariable) => <LineChart height={400} width={400} dataSets={{Speaker: ["blue", new TeamData(matches).getAsLine(independentVariable)]}}></LineChart>
    const [graphes,updateGraphes] = useState<typeof LineChart[]>([])
    const [isChecked, setChecked] = useState(false)
    const spreadGraphes = (graphArray)=>([...graphArray, graph(independentVariable.speakerMissed)])
    const handleChange = ()=> {
        setChecked(!isChecked)
        if(isChecked){
            updateGraphes(spreadGraphes(graphes))
        }
        if(!isChecked){
            updateGraphes([])
        }
    }
    return(
        <>
            <select id="teams" onChange={handleSelect}>{FRCTeamList.map(teamName => (
                <option value={teamName}>{teamName}</option>
            ))}</select>
            <Checkbox value="SpekerMiss" checked={isChecked} onChange={handleChange}> </Checkbox>
            {graphes}
        </>
    )
}
export default TeamStats;