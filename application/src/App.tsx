import React, { useEffect } from "react";
import "./App.css";

import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import ScouterTab from "./scouter/ScoutingTab";
import MatchList from "./scouter/MatchList";
import ScanningTab from "./scouter/scanner/ScanningTab";
import GeneralTab from "./strategy/GeneralTab";
import TeamTab from "./strategy/team-tab/TeamTab";
import ScouterPreMatch from "./scouter/tabs/ScouterPreMatch";
import ScouterTeleoperated from "./scouter/tabs/ScouterTeleoperated";
import ScouterAutonomous from "./scouter/tabs/ScouterAutonomous";
import ScouterPostMatch from "./scouter/tabs/ScouterPostMatch";
import StrategyTeleoperated from "./strategy/team-tab/sections/StrategyTeleoperated";
import StrategyAutonomous from "./strategy/team-tab/sections/StrategyAutonomous";
import StrategyEndgame from "./strategy/team-tab/sections/StrategyEndgame";

function getHiddenImage(path: string) {
  return (
    <div
      style={{
        backgroundImage: 'url("' + path + '")',
        width: 0,
        height: 0,
      }}
    ></div>
  );
}

export function renderScouterNavBar() {
  return (
    <nav className="nav-bar nav-bar-top">
      {getHiddenImage("./src/assets/crescendo-map.png")}
      {getHiddenImage("./src/assets/blue-auto-map.png")}
      {getHiddenImage("./src/assets/red-auto-map.png")}
      <ul>
        <li>
          <Link to="/">Match List</Link>
        </li>
        <li>
          <Link to="/scouting/prematch">Scout Game</Link>
        </li>
        <li>
          <Link to="/scanner">Scan Match</Link>
        </li>
      </ul>
    </nav>
  );
}

export function renderStrategyNavBar() {
  return (
    <nav className="nav-bar nav-bar-top">
      <ul>
        <li>
          <Link to="/team/autonomous">Team Data</Link>
        </li>
        <li>
          <Link to="/general">General</Link>
        </li>
      </ul>
    </nav>
  );
}

const App: React.FC = () => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Prevent default behavior and show a warning dialog
      event.preventDefault();
      event.returnValue = ""; // This triggers the browser's warning dialog.
    };

    // Attach the event listener for refresh and tab close
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // Clean up the event listener
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/scanner" Component={ScanningTab} />
        <Route path="/" Component={MatchList} />
        <Route path="/scouting" Component={ScouterTab}>
          <Route path="prematch" Component={ScouterPreMatch} />
          <Route path="teleoperated" Component={ScouterTeleoperated} />
          <Route path="autonomous" Component={ScouterAutonomous} />
          <Route path="postmatch" Component={ScouterPostMatch} />
        </Route>
        <Route path="/team" Component={TeamTab}>
          <Route path="teleoperated" Component={StrategyTeleoperated} />
          <Route path="autonomous" Component={StrategyAutonomous} />
          <Route path="endgame" Component={StrategyEndgame} />
        </Route>
        <Route path="/general" Component={GeneralTab} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
