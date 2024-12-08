import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw, Save } from "lucide-react";
import PreMatch from "./tabs/PreMatch";
import Autonomous from "./tabs/Autonomous";
import Teleoperated from "./tabs/Teleoperated";
import PostMatch from "./tabs/PostMatch";
import { renderScouterNavBar } from "../App";
import SureButton from "../components/SureButton";
import { queryFolder } from "../utils/FolderStorage";

const sections: React.FC[] = [PreMatch, Autonomous, Teleoperated, PostMatch];
const constantValues = ["Scouter Name", "Game Side"];

function ScouterTab() {
  const navigate = useNavigate();
  const [currentSectionNumber, setSectionNumber] = useState<number>(0);

  function handleSubmit() {
    const formValues: Record<string, string> = {};
    queryFolder.keys().forEach((item) => {
      formValues[item] = queryFolder.getItem(item) + "";
      if (!constantValues.includes(item)) {
        queryFolder.removeItem(item);
      }
    });

    navigate("/", { state: formValues });
  }

  function clearQueryStorage() {
    queryFolder.keys().forEach((item) => queryFolder.removeItem(item));
  }

  function handleReset() {
    clearQueryStorage();
    navigate("/");
  }

  return (
    <div className="w-full">
      {renderScouterNavBar()}
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mt-8 dark:bg-dark-card dark:border dark:border-dark-border"
        >
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-4">
              {sections[currentSectionNumber].name}
            </h1>
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex gap-2"
              >
                {currentSectionNumber !== 0 && (
                  <button
                    type="button"
                    onClick={() => setSectionNumber(currentSectionNumber - 1)}
                    className="btn btn-secondary flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>
                )}
                {currentSectionNumber !== sections.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setSectionNumber(currentSectionNumber + 1)}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            </div>
          </div>

          <motion.div
            key={currentSectionNumber}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mb-6"
          >
            {sections[currentSectionNumber].apply({})}
          </motion.div>

          <div className="flex justify-center gap-4 mt-8">
            <SureButton
              onClick={handleReset}
              className="btn btn-secondary flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </SureButton>
            {currentSectionNumber === sections.length - 1 && (
              <button
                type="button"
                onClick={handleSubmit}
                className="btn btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Submit
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ScouterTab;
