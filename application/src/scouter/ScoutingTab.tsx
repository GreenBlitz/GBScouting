import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { renderScouterNavBar } from "../App";
import CancelConfirmation from "../components/CancelConfirmation";
import { inputFolder } from "../utils/FolderStorage";
import PageTransition from "../components/PageTransition";
import Autonomous from "./tabs/Autonomous";
import PreMatch from "./tabs/PreMatch";
import Teleoperated from "./tabs/Teleoperated";
import PostMatch from "./tabs/PostMatch";
import Matches from "./Matches";
import ScouterInputs from "./ScouterInputs";
import ScouterInput from "./ScouterInput";
import { Match } from "../utils/Match";

const sectionNames: string[] = [
  PreMatch,
  Autonomous,
  Teleoperated,
  PostMatch,
].map((section) => section.name);
export default function ScoutingTab() {
  const navigate = useNavigate();
  const [currentSectionNumber, setSectionNumber] = useState<number>(0);

  const navigateToSection = (section: number) => {
    setSectionNumber(section);
    navigate(sectionNames[section]);
  };

  function handleSubmit() {
    const matchValues: Record<string, any> = {};

    Object.entries(ScouterInputs)
      .filter(([_, value]) => value instanceof ScouterInput)
      .forEach(([inputName, value]) => {
        const input = value as ScouterInput<any, any, any>;
        matchValues[inputName] = input.getValue();
        if (!input.shouldReset()) {
          input.storage.remove();
        }
      });

    Matches.add(matchValues as Match);
    navigate("/");
  }

  const handleReset = () => {
    inputFolder.keys().forEach((item) => inputFolder.removeItem(item));
    navigate("/");
  };

  const sectionElement = (
    <div className="space-y-6">
      <PageTransition>
        <div className="min-h-[400px]">
          <Outlet />
        </div>
      </PageTransition>
      <div className="flex justify-between items-center mt-8">
        <div>
          {currentSectionNumber !== 0 && (
            <button
              type="button"
              onClick={() => navigateToSection(currentSectionNumber - 1)}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
            >
              Previous
            </button>
          )}
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
          {currentSectionNumber === sectionNames.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={() => navigateToSection(currentSectionNumber + 1)}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-bg">
      {renderScouterNavBar()}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-dark-card rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-dark-text">
            {sectionNames[currentSectionNumber]}
          </h1>
          {sectionElement}
        </div>
      </div>
    </div>
  );
}
