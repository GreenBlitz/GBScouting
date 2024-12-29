import React, { useEffect, useState } from "react";
import { FRCTeamList, getMatchesByCriteria, Match } from "../../Utils";
import LineChart from "../charts/LineChart";
import { TeamData } from "../../TeamData";

const TeamStats: React.FC = ()=>{
    const [teamName, updateTeamName] = useState('');
    const [matches, updateMatches] = useState<Match[]>([])
    const teamNames = FRCTeamList
    const handleSelect =  async (event)=>{
        updateTeamName(event.target.value)
        updateMatches(await getMatchesByCriteria("Team Number", teamName))
    }
    return(
        <>
            <select id="teams" onChange={handleSelect}>{FRCTeamList.map(teamName => (
                <option value={teamName}>{teamName}</option>
            ))}</select>
            <LineChart height={400} 
            width={400}
            dataSets={{Speaker: ["blue", new TeamData(matches).getAsLine("Speaker Miss")]}}></LineChart>
        </>
    )
}
export default TeamStats;