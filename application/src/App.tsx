import React, { useState } from "react";
import "./App.css";

import ScouterTab from "./scouter/ScoutingTab";
import MatchList from "./scouter/MatchList";
import ScanningTab from "./scouter/scanner/ScanningTab";
import GeneralTab from "./strategy/GeneralTab";
import TeamTab from "./strategy/TeamTab";

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

export interface TabProps {
  navigate: (path: string, state?) => void;
  state: any;
  navBar: () => React.JSX.Element;
}

const pages = {
  "/ScannerTab": ScanningTab,
  "/": MatchList,
  "/ScouterTab": ScouterTab,
  "/TeamTab": TeamTab,
  "/GeneralTab": GeneralTab,
};
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<React.FC<TabProps>>();
  const [currentState, setCurrentState] = useState<any>({});

  function renderScouterNavBar() {
    return (
      <nav className="nav-bar">
        {getHiddenImage("./src/assets/Crescendo Map.png")}
        {getHiddenImage("./src/assets/Blue Auto Map.png")}
        {getHiddenImage("./src/assets/Red Auto Map.png")}
        <ul>
          <li>
            <button onClick={() => navigate("/")}>Match List</button>
          </li>
          <li>
            <button onClick={() => navigate("/ScouterTab")}>Scout Game</button>
          </li>
          <li>
            <button onClick={() => navigate("/ScannerTab")}>Scan Match</button>
          </li>
        </ul>
      </nav>
    );
  }

  function renderStrategyNavBar() {
    return (
      <nav className="nav-bar">
        <ul>
          <li>
            <button onClick={() => navigate("/TeamTab")}>TeamData</button>
          </li>
          <li>
            <button onClick={() => navigate("/GeneralTab")}>General</button>
          </li>
        </ul>
      </nav>
    );
  }

  const navigate = (path: string, state?) => {
    const page = pages[path] || MatchList; // Default to MatchList if page not found

    setCurrentPage(() => page);
    setCurrentState(state);
  };

  const CurrentPageComponent = currentPage || MatchList;
  return (
    <CurrentPageComponent
      navBar={renderScouterNavBar}
      navigate={navigate}
      state={{}}
    />
  );
};

export default App;
