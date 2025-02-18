import React, { useEffect } from "react";
import "./App.css";

import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import ScouterTab from "./scouter/ScoutingTab";
import MatchList from "./scouter/MatchList";
import ScanningTab from "./scouter/scanner/ScanningTab";
import GeneralTab from "./strategy/general-tab/GeneralTab";
import TeamTab from "./strategy/team-tab/TeamTab";
import ScouterPreMatch from "./scouter/tabs/ScouterPreMatch";
import ScouterTeleoperated, {
  ScouterTelePick,
  ScouterTeleReef,
} from "./scouter/tabs/ScouterTeleoperated";
import ScouterPostMatch from "./scouter/tabs/ScouterPostMatch";
import StrategyTeleoperated from "./strategy/team-tab/sections/StrategyTeleoperated";
import StrategyAutonomous from "./strategy/team-tab/sections/StrategyAutonomous";
import StrategyEndgame from "./strategy/team-tab/sections/StrategyEndgame";
import PageTransition from "./components/PageTransition";
import ScouterAutonomous, {
  ScouterAutoPick,
  ScouterAutoReef,
} from "./scouter/tabs/ScouterAutonomous";
import NoteTab from "./strategy/NoteTab";
import ComparisonTab from "./strategy/ComparisonTab";

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

const hiddenImages = [
  "./src/assets/crescendo-map.png",
  "./src/assets/blue-auto-map.png",
  "./src/assets/red-auto-map.png",
  "./src/assets/low-coral.svg",
  "./src/assets/low-algea.svg",
].map(getHiddenImage);

export function renderScouterNavBar() {
  return (
    <nav className="bg-dark-card shadow-lg w-86">
      <ul className="flex items-center justify-center space-x-6 py-4">
        <li>
          {[...hiddenImages]}

          <Link
            to="/"
            className="text-dark-text hover:text-primary-400 transition-colors"
          >
            Match List
          </Link>
        </li>
        <li>
          <Link
            to="/scouting/prematch"
            className="text-dark-text hover:text-primary-400 transition-colors"
          >
            Scout Game
          </Link>
        </li>
        <li>
          <Link
            to="/scanner"
            className="text-dark-text hover:text-primary-400 transition-colors"
          >
            Scan Match
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export function renderStrategyNavBar() {
  return (
    <nav className="bg-dark-card shadow-lg ">
      <ul className="flex items-center justify-center space-x-6 py-4">
        <li>
          <Link
            to="/compare"
            className="text-dark-text hover:text-primary-400 transition-colors"
          >
            Comparison
          </Link>
        </li>
        <li>
          {[...hiddenImages]}

          <Link
            to="/team/autonomous"
            className="text-dark-text hover:text-primary-400 transition-colors"
          >
            Team Data
          </Link>
        </li>
        <li>
          <Link
            to="/general"
            className="text-dark-text hover:text-primary-400 transition-colors"
          >
            General
          </Link>
        </li>
        <li>
          <Link
            to="/notes"
            className="text-dark-text hover:text-primary-400 transition-colors"
          >
            Notes
          </Link>
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
      <div className="min-h-screen min-w-screen bg-dark-bg ">
        <PageTransition>
          <Routes>
            <Route path="/scanner" element={<ScanningTab />} />
            <Route path="/" element={<MatchList />} />
            <Route path="/scouting" element={<ScouterTab />}>
              <Route path="prematch" element={<ScouterPreMatch />} />
              <Route path="teleoperated" element={<ScouterTeleoperated />}>
                <Route path="pick" element={<ScouterTelePick />} />
                <Route path="reef" element={<ScouterTeleReef />} />
              </Route>
              <Route path="autonomous" element={<ScouterAutonomous />}>
                <Route path="pick" element={<ScouterAutoPick />} />
                <Route path="reef" element={<ScouterAutoReef />} />
              </Route>
              <Route path="postmatch" element={<ScouterPostMatch />} />
            </Route>
            <Route path="/team" element={<TeamTab />}>
              <Route path="teleoperated" element={<StrategyTeleoperated />} />
              <Route path="autonomous" element={<StrategyAutonomous />} />
              <Route path="endgame" element={<StrategyEndgame />} />
            </Route>
            <Route path="/notes" element={<NoteTab />} />
            <Route path="/general" element={<GeneralTab />} />
            <Route path="/compare" element={<ComparisonTab />} />
          </Routes>
        </PageTransition>
      </div>
    </BrowserRouter>
  );
};

export default App;
