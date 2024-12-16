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
      {getHiddenImage("./src/assets/Crescendo Map.png")}
      {getHiddenImage("./src/assets/Blue Auto Map.png")}
      {getHiddenImage("./src/assets/Red Auto Map.png")}
      <ul>
        <li>
          <Link to="/">Match List</Link>
        </li>
        <li>
          <Link to="/ScouterTab/PreMatch">Scout Game</Link>
        </li>
        <li>
          <Link to="/ScannerTab">Scan Match</Link>
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
          <Link to="/TeamTab">Team Data</Link>
        </li>
        <li>
          <Link to="/GeneralTab">General</Link>
        </li>
      </ul>
    </nav>
  );
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ScannerTab" Component={ScanningTab} />
        <Route path="/" Component={MatchList} />
        <Route path="/ScouterTab" Component={ScouterTab}>
          <Route path="/PreMatch" Component={PreMatch} />
          <Route path="/Teleoperated" Component={Teleoperated} />
          <Route path="/Autonomous" Component={Autonomous} />
          <Route path="/PostMatch" Component={PostMatch} />
        </Route>
        <Route path="/TeamTab" Component={TeamTab} />
        <Route path="/GeneralTab" Component={GeneralTab} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
