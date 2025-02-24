import { Outlet, useLocation, useNavigate } from "react-router-dom";
import React, { useMemo } from "react";
import { renderScouterNavBar } from "../App";
import { inputFolder } from "../utils/FolderStorage";
import CancelConfirmation from "../components/CancelConfirmation";
import ScouterInputs from "./ScouterInputs.ts";
import ScouterInput from "./ScouterInput.tsx";
import { Match, matchFieldNames } from "../utils/Match";
import Matches from "./Matches";
import SectionHandler from "../utils/SectionHandler.ts";
import PageTransition from "../components/PageTransition";
import { FRCTeamList } from "../utils/Utils.ts";

const sectioNames = ["Prematch", "Autonomous", "Teleoperated", "Endgame"];

export default function ScoutingTab() {
  const navigate = useNavigate();
  const sectionHandler = useMemo(() => {
    return new SectionHandler(navigate, [
      "prematch",
      "autonomous/pick",
      "teleoperated/pick",
      "postmatch",
    ]);
  }, []);

  function handleSubmit() {
    const matchValues: Record<string, any> = {};

    Object.entries(ScouterInputs)
      .filter(([_, value]) => value instanceof ScouterInput)
      .forEach(([inputName, value]) => {
        const input = value as ScouterInput<any, any, any>;
        matchValues[inputName] = input.getValue();
        if (!input.shouldReset()) {
          input.clearValue();
        }
      });
    Matches.add(matchValues as Match);
    navigate("/scouter/matches");
  }

  const handleReset = () => {
    inputFolder.keys().forEach((item) => {
      if (item.endsWith(matchFieldNames.scouterName)) {
        return;
      }
      inputFolder.removeItem(item);
    });
    navigate("/scouter/matches");
  };

  const navigateToNext = () => {
    if (ScouterInputs.noShow.storage.get()) {
      handleSubmit();
    } else {
      sectionHandler.navigateNext();
    }
  };

  const isValid = (teamNumber: number) => {
    return !!FRCTeamList[teamNumber];
  };

  const teamNumber = ScouterInputs.teamNumber.getValue();
  const teamColor = isValid(teamNumber) ? "text-yellow-300" : "text-red-500";

  const sectionElement = (
    <div className="space-y-6">
      <div className="w-full flex flex-row">
        <h2
          className="text-4xl mt-2 ml-5"
          style={{ fontFamily: "Franklin Gothic Black" }}
        >
          {sectioNames[sectionHandler.getIndex()]}
        </h2>
        <div className="w-full" />
        <h3
          className={`text-2xl ${teamColor} mr-5 mt-2`}
          style={{ fontFamily: "Franklin Gothic Black" }}
        >
          {teamNumber !== 0 &&
            (isValid(teamNumber) ? teamNumber : "Invalid Team")}
        </h3>
      </div>
      <PageTransition>
        <div className="min-h-[400px]">
          <Outlet />
        </div>
      </PageTransition>
    </div>
  );

  const navigationButtons = (
    <div className="flex justify-between items-center mt-4">
      <div className="mr-auto ml-5 mb-2">
        {!sectionHandler.isFirst() && (
          <button
            type="button"
            onClick={() => sectionHandler.navigatePrevious()}
            className="py-2 w-20 move-button"
          >
            Prev
          </button>
        )}
      </div>
      <div className="flex gap-4 ml-auto mb-2 mr-2">
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
  );

  const frontColor =
    sectionHandler.getIndex() === 2 ? "bg-[#2C2C2C]" : "bg-dark-card";

  const location = useLocation();

  return (
    <div className="min-h-screen bg-dark-bg">
      {renderScouterNavBar()}
      <div className="max-w-4xl mx-auto py-6">
        <div className={`${frontColor} rounded-lg shadow-lg`}>
          {sectionElement}
          {!location.pathname.endsWith("reef") && navigationButtons}
        </div>
      </div>
    </div>
  );
}
