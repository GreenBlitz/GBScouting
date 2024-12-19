import React from "react";
import "./App.css";

import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import ScouterTab from "./scouter/ScoutingTab";
import MatchList from "./scouter/MatchList";
import ScanningTab from "./scouter/scanner/ScanningTab";
import GeneralTab from "./strategy/GeneralTab";
import TeamTab from "./strategy/TeamTab";
import PreMatch from "./scouter/tabs/PreMatch";
import Teleoperated from "./scouter/tabs/Teleoperated";
import Autonomous from "./scouter/tabs/Autonomous";
import PostMatch from "./scouter/tabs/PostMatch";

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
    <nav className="nav-bar">
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
    <nav className="nav-bar">
      <ul>
        <li>
          <Link to="/team">Team Data</Link>
        </li>
        <li>
          <Link to="/general">General</Link>
        </li>
      </ul>
    </nav>
  );
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/scanner" Component={ScanningTab} />
        <Route path="/" Component={MatchList} />
        <Route path="/scouting" Component={ScouterTab}>
          <Route path="prematch" Component={PreMatch} />
          <Route path="teleoperated" Component={Teleoperated} />
          <Route path="autonomous" Component={Autonomous} />
          <Route path="postmatch" Component={PostMatch} />
        </Route>
        <Route path="/team" Component={TeamTab} />
        <Route path="/general" Component={GeneralTab} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
