import { useEffect, useState } from "react";
import { TeamData } from "../../TeamData";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import TeamPicker, { mergeSimilarMatches } from "../../components/TeamPicker";
import {  fetchTeams } from "../../utils/Fetches";
import { GridItems, processTeamData } from "../general-tab/GeneralTab";
import { FRCTeamList } from "../../utils/Utils";

const TeamTab: React.FC = () => {
  const [teamData, setTeamData] = useState<TeamData>(new TeamData([]));

  const [teamTable, setTeamTable] = useState<GridItems[]>([]);

  //bruh this is kinda deep
  useEffect(() => {
    async function getGridItems() {
      return Object.entries(
        await fetchTeams(Object.keys(FRCTeamList).map((key) => parseInt(key)))
      ).map(([team, matches]) =>
        processTeamData(
          parseInt(team),
          new TeamData(mergeSimilarMatches(matches))
        )
      );
    }
    async function updateTeamTable() {
      setTeamTable(await getGridItems());
    }
    updateTeamTable();
  }, []);

  return (
    <div className="strategy-app">
      <br />
      <br />
      <TeamPicker setTeamData={setTeamData} defaultRecency={5} />
      <br />
      <nav className="nav-bar">
        <ul>
          <li>
            <Link to="/strategy/team/autonomous">Autonomous</Link>
          </li>
          <li>
            <Link to="/strategy/team/teleoperated/linear">Teleoperated</Link>
          </li>
        </ul>
      </nav>
      <Outlet context={{ teamData, teamTable }} />
    </div>
  );
};

export default TeamTab;
