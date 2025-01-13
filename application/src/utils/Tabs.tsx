import { Link, RouteObject } from "react-router-dom";
import MatchList from "../scouter/MatchList";
import ScouterTab from "../scouter/ScoutingTab";
import Teleoperated from "../scouter/tabs/Teleoperated";
import React from "react";
import PreMatch from "../scouter/tabs/PreMatch";
import Autonomous from "../scouter/tabs/Autonomous";
import PostMatch from "../scouter/tabs/PostMatch";
import ScanningTab from "../scouter/scanner/ScanningTab";
import GeneralTab from "../strategy/GeneralTab";
import TeamTab from "../strategy/TeamTab";

class Tabs<TabRecord extends Record<string, RouteObject>> {
  public readonly tabs: TabRecord;

  constructor(tabs: TabRecord) {
    this.tabs = tabs;
  }

  private getFullPathOfRoute(route: RouteObject): string {
    if (!route.children || route.children.length === 0) {
      return route.path + "";
    }
    return route.path + "/" + this.getFullPathOfRoute(route.children[0]);
  }

  public renderNavBar() {
    return (
      <nav className="nav-bar">
        <ul>
          {Object.entries(this.tabs).map(([name, tab]) => (
            <li>
              <Link to={this.getFullPathOfRoute(tab)}>{name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

export const scouterTabs = new Tabs({
  "Match List": { path: "/", element: <MatchList /> },
  "Scout Game": {
    path: "/scouting",
    element: <ScouterTab />,
    children: [
      { path: "prematch", element: <PreMatch /> },
      { path: "teleoperated", element: <Teleoperated /> },
      { path: "autonomous", element: <Autonomous /> },
      { path: "postmatch", element: <PostMatch /> },
    ],
  },
  "Scan Match": { path: "/scanner", element: <ScanningTab /> },
});

export const stratgyTabs = new Tabs({
  "Team Data": {
    path: "/team",
    element: <TeamTab />,
    children: [
      // { path: "teleoperated", element: <Teleoperated /> },
      // { path: "autonomous", element: <Autonomous /> },
      // { path: "postmatch", element: <PostMatch /> },
    ],
  },
  "General Data": { path: "/general", element: <GeneralTab /> },
});
const keys = scouterTabs.tabs;
