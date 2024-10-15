import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import ScouterTab from "./ScoutingTab";
import MatchList from "./MatchList";
import React from "react";
import ScanningTab from "./scanner/ScanningTab";

function ScouterApp() {
  function renderNavBar() {
    return (
      <nav className="scouter-nav-bar">
        <ul>
          <li>
            <Link to="/">Match List</Link>
          </li>
          <li>
            <Link to="/ScouterTab">Scout Game</Link>
          </li>
          <li>
            <Link to="/ScannerTab">Scan Match</Link>
          </li>
        </ul>
      </nav>
    );
  }

  return (
    <BrowserRouter>
      {renderNavBar()}
      <Routes>
        <Route path="/ScannerTab" Component={ScanningTab} />
        <Route path="/" Component={MatchList} />
        <Route path="/ScouterTab" Component={ScouterTab} />
      </Routes>
    </BrowserRouter>
  );
}

export default ScouterApp;