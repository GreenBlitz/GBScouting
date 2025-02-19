import { useState } from "react";
import { TeamData } from "../../TeamData";
import React from "react";
import { renderStrategyNavBar } from "../../App";
import { Link, Outlet } from "react-router-dom";
import TeamPicker from "../../components/TeamPicker";

const TeamTab: React.FC = () => {
  const [teamData, setTeamData] = useState<TeamData>(new TeamData([]));

  

  return (
    <div className="strategy-app">
      {renderStrategyNavBar()}
      <br />
      <br />
      <TeamPicker
        setTeamData={setTeamData}
        defaultRecency={5}
      />
      <br />
      <nav className="nav-bar">
        <ul>
          <li>
            <Link to="/strategy/team/autonomous">Autonomous</Link>
          </li>
          <li>
            <Link to="/strategy/team/teleoperated">Teleoperated</Link>
          </li>
          <li>
            <Link to="/strategy/team/endgame">Endgame</Link>
          </li>
        </ul>
      </nav>
      <Outlet context={{ teamData }} />
    </div>
  );
};

export default TeamTab;
