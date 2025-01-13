import React, { useEffect } from "react";
import "./App.css";
import { scouterTabs, stratgyTabs } from "./utils/Tabs";
import { BrowserRouter, useRoutes } from "react-router-dom";

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

  const Routes = () =>
    useRoutes(
      Object.values(scouterTabs.tabs).concat(Object.values(stratgyTabs.tabs))
    );
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
};

export default App;
