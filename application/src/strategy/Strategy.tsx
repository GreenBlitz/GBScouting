import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { authorizationStorage } from "../utils/FolderStorage";
import PasswordUpdater from "../components/PasswordUpdater";
import { loadedHiddenImages } from "../App";

const Strategy: React.FC = () => {
  const navBar = (
    <nav className="bg-dark-card shadow-lg ">
      <ul className="flex items-center justify-center space-x-6 py-4">
        <li>
          <Link
            to="/strategy/compare"
            className="text-dark-text hover:text-primary-400 transition-colors"
          >
            Comparison
          </Link>
        </li>
        <li>
          {[...loadedHiddenImages]}

          <Link
            to="/strategy/team/autonomous"
            className="text-dark-text hover:text-primary-400 transition-colors"
          >
            Team Data
          </Link>
        </li>
        <li>
          <Link
            to="/strategy/general"
            className="text-dark-text hover:text-primary-400 transition-colors"
          >
            General
          </Link>
        </li>
        <li>
          <Link
            to="/strategy/notes"
            className="text-dark-text hover:text-primary-400 transition-colors"
          >
            Notes
          </Link>
        </li>
      </ul>
    </nav>
  );

  if (authorizationStorage.get()) {
    return <>{navBar}<Outlet /></>;
  }

  return <PasswordUpdater storageUpdater={authorizationStorage.set} />;
};

export default Strategy;
