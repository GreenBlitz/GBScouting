import { Outlet, useNavigate } from "react-router-dom";
import React, { useMemo } from "react";
import { renderScouterNavBar } from "../App";
import { inputFolder } from "../utils/FolderStorage";
import CancelConfirmation from "../components/CancelConfirmation";
import ScouterInputs from "./ScouterInputs.ts";
import ScouterInput from "./ScouterInput.tsx";
import { Match } from "../utils/Match";
import Matches from "./Matches";
import SectionHandler from "../utils/SectionHandler.ts";
import PageTransition from "../components/PageTransition";

const sectionNames: string[] = [
  "prematch",
  "autonomous/pick",
  "teleoperated/pick",
  "postmatch",
];

export default function ScoutingTab() {
  const navigate = useNavigate();
  const sectionHandler = useMemo(() => {
    return new SectionHandler(navigate, sectionNames);
  }, []);

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

  const navigateToNext = () => {
    if (ScouterInputs.noShow.storage.get()) {
      handleSubmit();
    } else {
      sectionHandler.navigateNext();
    }
  };

  const sectionElement = (
    <div className="space-y-6">
      <div className="w-full flex flex-row">
        <div className="w-56 mt-2">
          {!sectionHandler.isFirst() && (
            <button
              type="button"
              onClick={() => sectionHandler.navigatePrevious()}
              className="py-2 w-20 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
            >
              Prev
            </button>
          )}
        </div>
        <h2
          className="text-4xl mt-2"
          style={{ fontFamily: "Franklin Gothic Black" }}
        ></h2>
        <div className="w-full" />
        <h3
          className="text-2xl text-yellow-300 mr-5 mt-2"
          style={{ fontFamily: "Franklin Gothic Black" }}
        >
          {ScouterInputs.teamNumber.getValue()}
        </h3>
      </div>
      <PageTransition>
        <div className="min-h-[400px]">
          <Outlet />
        </div>
      </PageTransition>
      <div className="flex justify-between items-center mt-8">
        <div className="flex gap-4 ml-auto">
          <CancelConfirmation name="Reset" onClick={handleReset} />
          {sectionHandler.isLast() ? (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={navigateToNext}
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
      <div className="max-w-4xl mx-auto py-6">
        <div className="bg-dark-card rounded-lg shadow-lg">
          {sectionElement}
        </div>
      </div>
    </div>
  );
}
