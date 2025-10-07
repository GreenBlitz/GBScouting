import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { authorizationStorage } from "../utils/FolderStorage";
import PasswordUpdater from "../components/PasswordUpdater";
import { loadedHiddenImages } from "../App";

interface NavItemProps {
  name: string;
  path: string;
}

const NavItem: React.FC<NavItemProps> = ({ name, path }) => {
  return (
    <li>
      <Link
        to={path}
        className="text-dark-text hover:text-primary-400 transition-colors whitespace-nowrap px-2 py-1 rounded-md hover:bg-dark-card/60"
      >
        {name}
      </Link>
    </li>
  );
};

const Strategy: React.FC = () => {
  const setReload = useState(false)[1];
  const navBar = (
    <nav className="bg-dark-card shadow-lg w-full">
      <ul className="flex items-center md:justify-center justify-start gap-x-6 gap-y-2 py-4 px-4 w-full overflow-x-auto md:overflow-visible flex-nowrap md:flex-wrap">
        <li>
          <NavItem path="/strategy/compare" name="Comparison" />
        </li>
        <li>
          {[...loadedHiddenImages]}
          <NavItem path="/strategy/team/teleoperated/linear" name="Team Data" />
        </li>
        <li>
          <NavItem path="/strategy/general" name="General" />
        </li>
        <li>
          <NavItem path="/strategy/notes" name="Notes" />
        </li>
        <li>
          <NavItem path="/strategy/scouter-stats" name="Scouter Stats" />
        </li>
        <li>
          <NavItem path="/strategy/ability" name="Abilities" />
        </li>
        <li>
          <NavItem path="/strategy/tinder" name="Tinder" />
        </li>
        <li>
          <NavItem path="/strategy/qual" name="Qual" />
        </li>
      </ul>
    </nav>
  );

  // if (authorizationStorage.get()) {
  return (
    <>
      {navBar}
      <Outlet />
    </>
  );
  // }

  return (
    <PasswordUpdater
      storageUpdater={(value) => {
        authorizationStorage.set(value);
        setReload(true);
      }}
    />
  );
};

export default Strategy;
