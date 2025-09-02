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
        className="text-dark-text hover:text-primary-400 transition-colors"
      >
        {name}
      </Link>
    </li>
  );
};

const Strategy: React.FC = () => {
  const setReload = useState(false)[1];
  const navBar = (
    <nav className="bg-dark-card shadow-lg ">
      <ul className="flex items-center justify-center space-x-6 py-4">
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
