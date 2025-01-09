import React from "react";
import "./App.css";

import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import ScouterTab from "./scouter/ScoutingTab";
import MatchList from "./scouter/MatchList";
import ScanningTab from "./scouter/scanner/ScanningTab";
import GeneralTab from "./strategy/GeneralTab";
import TeamTab from "./strategy/TeamTab";
import PreMatch from "./scouter/tabs/PreMatch";
import Teleoperated from "./scouter/tabs/Teleoperated";
import Autonomous from "./scouter/tabs/Autonomous";
import PostMatch from "./scouter/tabs/PostMatch";
import PageTransition from "./components/PageTransition";

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
    <nav className="bg-dark-card shadow-lg">
      {getHiddenImage("./src/assets/crescendo-map.png")}
      {getHiddenImage("./src/assets/blue-auto-map.png")}
      {getHiddenImage("./src/assets/red-auto-map.png")}
      <ul className="flex items-center justify-center space-x-6 py-4">
        <li>
          <Link to="/" className="text-dark-text hover:text-primary-400 transition-colors">Match List</Link>
        </li>
        <li>
          <Link to="/scouting/prematch" className="text-dark-text hover:text-primary-400 transition-colors">Scout Game</Link>
        </li>
        <li>
          <Link to="/scanner" className="text-dark-text hover:text-primary-400 transition-colors">Scan Match</Link>
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

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark-bg">
        <PageTransition>
          <Routes>
            <Route path="/scanner" element={<ScanningTab />} />
            <Route path="/" element={<MatchList />} />
            <Route path="/scouting" element={<ScouterTab />}>
              <Route path="prematch" element={<PreMatch />} />
              <Route path="teleoperated" element={<Teleoperated />} />
              <Route path="autonomous" element={<Autonomous />} />
              <Route path="postmatch" element={<PostMatch />} />
            </Route>
            <Route path="/team" element={<TeamTab />} />
            <Route path="/general" element={<GeneralTab />} />
          </Routes>
        </PageTransition>
      </div>
    </BrowserRouter>
  );
}

export default App;
