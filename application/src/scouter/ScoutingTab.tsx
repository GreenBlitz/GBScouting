import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { renderScouterNavBar } from "../App";
import CancelConfirmation from "../components/CancelConfirmation";
import { inputFolder } from "../utils/FolderStorage";
import PageTransition from "../components/PageTransition";

const sectionNames = ["Pre-Match", "Autonomous", "Teleoperated", "Post-Match"];

export default function ScoutingTab() {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const currentSectionNumber = ["prematch", "autonomous", "teleoperated", "postmatch"].findIndex(
    (section) => currentPath.includes(section)
  );

  const navigateToSection = (sectionNumber: number) => {
    const sections = ["prematch", "autonomous", "teleoperated", "postmatch"];
    navigate(`/scouting/${sections[sectionNumber]}`);
  };

  const handleSubmit = () => {
    inputFolder.keys().forEach((item) => inputFolder.removeItem(item));
    navigate("/");
  };

  const handleReset = () => {
    inputFolder.keys().forEach((item) => inputFolder.removeItem(item));
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {renderScouterNavBar()}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-dark-card rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-dark-text">
            {sectionNames[currentSectionNumber]}
          </h1>
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
        </div>
      </div>
    </div>
  );
}
