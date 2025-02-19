import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { authorizationStorage } from "../utils/FolderStorage";
import PasswordUpdater from "../components/PasswordUpdater";

const Strategy: React.FC = () => {

  if (authorizationStorage.get()) {
    return <Outlet />;
  }

  return (
    <PasswordUpdater storageUpdater={authorizationStorage.set}/>
  );
};

export default Strategy;
