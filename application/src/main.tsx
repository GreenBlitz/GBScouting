import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import React from "react";
import AlgaeButton from "./scouter/AlgaeButton.tsx";
import CoralButton from "./scouter/CoralButton.tsx";
import AutonomousForm from "./scouter/AutonomousForm.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <AlgaeButton /> */}
    <AutonomousForm />
    {/* <CoralButton /> */}
  </StrictMode>
);
