import React, { useEffect, useState } from "react";
import { FRCTeamList, getMatchesByCriteria, Match } from "../../Utils";
import LineChart from "../charts/LineChart";
import { TeamData } from "../../TeamData";
import { Checkbox, FormLabel } from "@mui/material";
import TeamStats from "./TeamStats";

const ComparisonBetweenTeams: React.FC = ()=> {
    return <>
        <TeamStats></TeamStats>
        <TeamStats></TeamStats>
    </>    
}
export default ComparisonBetweenTeams