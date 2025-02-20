import React, { useEffect } from "react";
import "./App.css";

import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import ScouterTab from "./scouter/ScoutingTab";
import MatchList from "./scouter/MatchList";
import ScanningTab from "./scouter/scanner/ScanningTab";
import GeneralTab from "./strategy/general-tab/GeneralTab";
import TeamTab from "./strategy/team-tab/TeamTab";
import ScouterPreMatch from "./scouter/tabs/ScouterPreMatch";
import ScouterTeleoperated, {
  ScouterTelePick,
} from "./scouter/tabs/ScouterTeleoperated";
import ScouterPostMatch from "./scouter/tabs/ScouterPostMatch";
import StrategyTeleoperated from "./strategy/team-tab/sections/StrategyTeleoperated";
import StrategyAutonomous from "./strategy/team-tab/sections/StrategyAutonomous";
import StrategyEndgame from "./strategy/team-tab/sections/StrategyEndgame";
import PageTransition from "./components/PageTransition";
import ScouterAutonomous, {
  ScouterAutoPick,
} from "./scouter/tabs/ScouterAutonomous";
import NoteTab from "./strategy/NoteTab";
import ComparisonTab from "./strategy/ComparisonTab";
import Strategy from "./strategy/Strategy";
import PasswordUpdater from "./components/PasswordUpdater";
import { authorizationStorage } from "./utils/FolderStorage";

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

export const loadedHiddenImages = [
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
          {[...loadedHiddenImages]}

          <Link
            to="/scouter/matches"
            className="text-dark-text hover:text-primary-400 transition-colors"
          >
            Matches
          </Link>
        </li>
        <li>
          <Link
            to="/scouter/scouting/prematch"
            className="text-dark-text hover:text-primary-400 transition-colors"
          >
            Scout
          </Link>
        </li>
        <li>
          <Link
            to="/scouter/scanner"
            className="text-dark-text hover:text-primary-400 transition-colors"
          >
            Scan
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
            <Route path="/" element={<Navigate to="/scouter/matches" />} />
            <Route
              path="/stratpass"
              element={
                <PasswordUpdater
                  storageUpdater={(value) => authorizationStorage.set(value)}
                />
              }
            />
            <Route path="/scouter">
              <Route path="scanner" element={<ScanningTab />} />
              <Route path="matches" element={<MatchList />} />
              <Route path="scouting" element={<ScouterTab />}>
                <Route path="prematch" element={<ScouterPreMatch />} />
                <Route path="teleoperated" element={<ScouterTeleoperated />}>
                  <Route path="pick" element={<ScouterTelePick />} />
                </Route>
                <Route path="autonomous" element={<ScouterAutonomous />}>
                  <Route path="pick" element={<ScouterAutoPick />} />
                </Route>
                <Route path="postmatch" element={<ScouterPostMatch />} />
              </Route>
            </Route>
            <Route path="/strategy" element={<Strategy />}>
              <Route path="team" element={<TeamTab />}>
                <Route path="teleoperated" element={<StrategyTeleoperated />} />
                <Route path="autonomous" element={<StrategyAutonomous />} />
                <Route path="endgame" element={<StrategyEndgame />} />
              </Route>
              <Route path="notes" element={<NoteTab />} />
              <Route path="general" element={<GeneralTab />} />
              <Route path="compare" element={<ComparisonTab />} />
            </Route>
          </Routes>
        </PageTransition>
      </div>
    </BrowserRouter>
  );
};

export default App;
